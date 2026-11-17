import { fsrs, Rating, State, createEmptyCard, type Card as FSRSCard } from 'ts-fsrs'
import { db, LexiClipDB } from '../db/lexiclipDatabase'
import type { UserCardState, ReviewLog, OutboxItem, WordEntry, LearningTopic, DailyGoalSetting } from '../types/lexiclip'

export interface DueWordCard {
  word: WordEntry
  cardState: UserCardState
}

export interface LearningStats {
  totalWords: number
  newCards: number
  learningCards: number
  reviewCards: number
  dueToday: number
  totalReviews: number
}

export interface UndoSnapshot {
  previousState: UserCardState
  reviewLogId: string
  timestamp: number
}

const SETTINGS_KEY = 'lexiclip_daily_settings'

export class FsrsSchedulerService {
  private database: LexiClipDB
  private f = fsrs()
  private lastUndoSnapshot: UndoSnapshot | null = null

  constructor(database: LexiClipDB = db) {
    this.database = database
  }

  // 讀取每日自訂學習設定
  getDailySettings(): DailyGoalSetting {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // 容錯降級
    }
    return {
      targetNewCards: 10,
      preferredTopic: 'all',
      autoPlayAudio: true,
    }
  }

  // 儲存每日自訂學習設定
  saveDailySettings(settings: DailyGoalSetting): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // 容錯降級
    }
  }

  // 將資料庫儲存的狀態轉化為 FSRS Card 格式
  private toFSRSCard(state: UserCardState): FSRSCard {
    return {
      due: new Date(state.due),
      stability: state.stability,
      difficulty: state.difficulty,
      scheduled_days: state.scheduled_days,
      learning_steps: state.learning_steps ?? 0,
      reps: state.reps,
      lapses: state.lapses,
      state: state.state as State,
      last_review: state.last_review ? new Date(state.last_review) : undefined,
    }
  }

  // 取得今日待複習或學習的單字清單 (支援依主題方向篩選，可指定只複習星號生詞)
  async getDueCards(
    limit = 20,
    topic: LearningTopic = 'all',
    onlyStarred = false
  ): Promise<DueWordCard[]> {
    const nowIso = new Date().toISOString()

    // 取得指定主題的單字 ID 集合
    let topicWordIdSet: Set<string> | null = null
    if (topic !== 'all') {
      const topicWords = await this.database.words.where('topic').equals(topic).toArray()
      topicWordIdSet = new Set(topicWords.map((w) => w.id))
    }

    // 取得所有未軟刪除且到期時間 <= 當前時間的卡片
    let dueStates = await this.database.cardStates
      .filter((c) => {
        const notDeleted = !c.deletedAt
        const isDue = c.due <= nowIso
        const matchesTopic = !topicWordIdSet || topicWordIdSet.has(c.wordId)
        const matchesStarred = !onlyStarred || c.starred === 1
        return notDeleted && isDue && matchesTopic && matchesStarred
      })
      .limit(limit)
      .toArray()

    if (dueStates.length === 0) {
      // 若無到期卡片，取從未學習過的新卡片 (state === 0)
      const settings = this.getDailySettings()
      const newCardLimit = Math.min(limit, settings.targetNewCards || 10)

      dueStates = await this.database.cardStates
        .filter((c) => {
          const notDeleted = !c.deletedAt
          const isNew = c.state === 0
          const matchesTopic = !topicWordIdSet || topicWordIdSet.has(c.wordId)
          const matchesStarred = !onlyStarred || c.starred === 1
          return notDeleted && isNew && matchesTopic && matchesStarred
        })
        .limit(newCardLimit)
        .toArray()
    }

    if (onlyStarred && dueStates.length === 0) {
      // 生詞衝刺模式：若無當期到期卡，拉取所有標記收藏的生詞供強化複習
      dueStates = await this.database.cardStates
        .filter((c) => {
          const notDeleted = !c.deletedAt
          const isStarred = c.starred === 1
          const matchesTopic = !topicWordIdSet || topicWordIdSet.has(c.wordId)
          return notDeleted && isStarred && matchesTopic
        })
        .limit(limit)
        .toArray()
    }

    const wordIds = dueStates.map((s) => s.wordId)
    const words = await this.database.words.where('id').anyOf(wordIds).toArray()
    const wordMap = new Map(words.map((w) => [w.id, w]))

    return dueStates
      .map((s) => {
        const word = wordMap.get(s.wordId)
        if (!word) return null
        return { word, cardState: s }
      })
      .filter((item): item is DueWordCard => item !== null)
  }

  // 切換單字星號收藏狀態
  async toggleWordStar(wordId: string): Promise<boolean> {
    return await this.database.toggleStar(wordId)
  }

  // 檢查單字是否已被加星號收藏
  async isWordStarred(wordId: string): Promise<boolean> {
    const card = await this.database.cardStates.get(wordId)
    return card?.starred === 1
  }

  // 執行單字評分複習 (Rating: 1=Again, 2=Hard, 3=Good, 4=Easy)
  async reviewCard(wordId: string, rating: 1 | 2 | 3 | 4): Promise<UserCardState> {
    const now = new Date()
    let current = await this.database.cardStates.get(wordId)

    if (!current) {
      const empty = createEmptyCard(now)
      current = {
        wordId,
        state: empty.state,
        due: empty.due.toISOString(),
        stability: empty.stability,
        difficulty: empty.difficulty,
        scheduled_days: empty.scheduled_days,
        learning_steps: empty.learning_steps,
        reps: empty.reps,
        lapses: empty.lapses,
        syncStatus: 'pending',
        updatedAt: now.toISOString(),
      }
    }

    // 保留 Undo 快照 (8 秒內可復原)
    const snapshot: UndoSnapshot = {
      previousState: { ...current },
      reviewLogId: `rev_${wordId}_${now.getTime()}`,
      timestamp: now.getTime(),
    }
    this.lastUndoSnapshot = snapshot

    const card = this.toFSRSCard(current)
    const schedulingCards = this.f.repeat(card, now)

    const gradeMap = {
      1: Rating.Again,
      2: Rating.Hard,
      3: Rating.Good,
      4: Rating.Easy,
    } as const

    const item = schedulingCards[gradeMap[rating]]
    const nextCard = item.card
    const log = item.log

    const updatedState: UserCardState = {
      wordId,
      state: nextCard.state,
      due: nextCard.due.toISOString(),
      stability: nextCard.stability,
      difficulty: nextCard.difficulty,
      scheduled_days: nextCard.scheduled_days,
      learning_steps: nextCard.learning_steps,
      reps: nextCard.reps,
      lapses: nextCard.lapses,
      last_review: nextCard.last_review ? nextCard.last_review.toISOString() : now.toISOString(),
      syncStatus: 'pending',
      updatedAt: now.toISOString(),
    }

    const reviewLog: ReviewLog = {
      id: snapshot.reviewLogId,
      wordId,
      rating,
      review: now.toISOString(),
      state: log.state,
      due: nextCard.due.toISOString(),
      stability: nextCard.stability,
      difficulty: nextCard.difficulty,
      scheduled_days: nextCard.scheduled_days,
      learning_steps: log.learning_steps,
      idempotencyKey: `idem_${wordId}_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    }

    const outboxItem: OutboxItem = {
      id: `outbox_${reviewLog.id}`,
      entityType: 'review',
      entityId: wordId,
      action: 'upsert',
      payload: JSON.stringify({ state: updatedState, log: reviewLog }),
      createdAt: now.toISOString(),
      attempts: 0,
    }

    await this.database.recordReviewAtomic(updatedState, reviewLog, outboxItem)
    return updatedState
  }

  // 8 秒內復原上一筆評分 (Undo)
  async undoLastReview(): Promise<boolean> {
    if (!this.lastUndoSnapshot) {
      return false
    }

    const now = Date.now()
    if (now - this.lastUndoSnapshot.timestamp > 8000) {
      this.lastUndoSnapshot = null
      return false
    }

    const { previousState, reviewLogId } = this.lastUndoSnapshot
    await this.database.transaction('rw', this.database.cardStates, this.database.reviewLogs, this.database.outbox, async () => {
      await this.database.cardStates.put(previousState)
      await this.database.reviewLogs.delete(reviewLogId)
      await this.database.outbox.delete(`outbox_${reviewLogId}`)
    })

    this.lastUndoSnapshot = null
    return true
  }

  // 取得學習概況與各狀態統計
  async getLearningStats(): Promise<LearningStats> {
    const cards = await this.database.cardStates.filter((c) => !c.deletedAt).toArray()
    const nowIso = new Date().toISOString()
    const totalReviews = await this.database.reviewLogs.count()

    let newCards = 0
    let learningCards = 0
    let reviewCards = 0
    let dueToday = 0

    for (const c of cards) {
      if (c.state === 0) {
        newCards++
      } else if (c.state === 1 || c.state === 3) {
        learningCards++
      } else {
        reviewCards++
      }

      if (c.due <= nowIso) {
        dueToday++
      }
    }

    return {
      totalWords: cards.length,
      newCards,
      learningCards,
      reviewCards,
      dueToday,
      totalReviews,
    }
  }
}

export const fsrsScheduler = new FsrsSchedulerService()
