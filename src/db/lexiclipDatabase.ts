import Dexie, { type Table } from 'dexie'
import type {
  WordEntry,
  RootMorpheme,
  MediaClip,
  UserCardState,
  ReviewLog,
  OutboxItem,
} from '../types/lexiclip'

export class LexiClipDB extends Dexie {
  words!: Table<WordEntry, string>
  roots!: Table<RootMorpheme, string>
  clips!: Table<MediaClip, string>
  cardStates!: Table<UserCardState, string>
  reviewLogs!: Table<ReviewLog, string>
  outbox!: Table<OutboxItem, string>

  constructor(dbName = 'LexiClipDatabase') {
    super(dbName)
    this.version(1).stores({
      words: 'id, word, levelTag, *rootIds',
      roots: 'id, morpheme, type, *cognateWordIds',
      clips: 'id, wordId, videoId, status',
      cardStates: 'wordId, due, state, syncStatus, updatedAt',
      reviewLogs: 'id, wordId, rating, review, idempotencyKey',
      outbox: 'id, entityType, action, createdAt',
    })

    this.version(2).stores({
      words: 'id, word, levelTag, topic, *rootIds',
      roots: 'id, morpheme, type, *cognateWordIds',
      clips: 'id, wordId, videoId, topic, status',
      cardStates: 'wordId, due, state, syncStatus, updatedAt',
      reviewLogs: 'id, wordId, rating, review, idempotencyKey',
      outbox: 'id, entityType, action, createdAt',
    })

    this.version(3).stores({
      words: 'id, word, levelTag, topic, *rootIds',
      roots: 'id, morpheme, type, *cognateWordIds',
      clips: 'id, wordId, videoId, topic, status',
      cardStates: 'wordId, due, state, syncStatus, starred, updatedAt',
      reviewLogs: 'id, wordId, rating, review, idempotencyKey',
      outbox: 'id, entityType, action, createdAt',
    })
  }

  // 切換單字星號收藏狀態 (1: 收藏, 0: 取消收藏)
  async toggleStar(wordId: string): Promise<boolean> {
    const existing = await this.cardStates.get(wordId)
    const newStarred = existing?.starred === 1 ? 0 : 1
    if (existing) {
      await this.cardStates.put({
        ...existing,
        starred: newStarred,
        updatedAt: new Date().toISOString(),
      })
    } else {
      await this.cardStates.put({
        wordId,
        state: 0,
        due: new Date().toISOString(),
        stability: 0,
        difficulty: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        starred: newStarred,
        syncStatus: 'pending',
        updatedAt: new Date().toISOString(),
      })
    }
    return newStarred === 1
  }

  // 取得全部已收藏生詞的 wordId 清單
  async getStarredWordIds(): Promise<string[]> {
    const states = await this.cardStates.where('starred').equals(1).toArray()
    return states.map((s) => s.wordId)
  }

  // 原子性事務記錄複習與排程
  async recordReviewAtomic(
    cardState: UserCardState,
    reviewLog: ReviewLog,
    outboxItem?: OutboxItem
  ): Promise<void> {
    await this.transaction('rw', this.cardStates, this.reviewLogs, this.outbox, async () => {
      await this.cardStates.put(cardState)
      await this.reviewLogs.put(reviewLog)
      if (outboxItem) {
        await this.outbox.put(outboxItem)
      }
    })
  }

  // 軟刪除/復原單字狀態
  async softDeleteCard(wordId: string): Promise<void> {
    const existing = await this.cardStates.get(wordId)
    if (existing) {
      await this.cardStates.put({
        ...existing,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      })
    }
  }

  async restoreCard(wordId: string): Promise<void> {
    const existing = await this.cardStates.get(wordId)
    if (existing) {
      const { deletedAt: _, ...rest } = existing
      await this.cardStates.put({
        ...rest,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      })
    }
  }
}

export const db = new LexiClipDB()
