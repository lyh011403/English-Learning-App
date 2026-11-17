import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LexiClipDB } from '../db/lexiclipDatabase'
import { MorphemeService } from './morphemeService'
import { FsrsSchedulerService } from './fsrsScheduler'

describe('T4: FSRS 記憶排程引擎', () => {
  let testDb: LexiClipDB
  let morphemeService: MorphemeService
  let scheduler: FsrsSchedulerService

  beforeEach(async () => {
    testDb = new LexiClipDB(`test_fsrs_db_${Date.now()}`)
    morphemeService = new MorphemeService(testDb)
    scheduler = new FsrsSchedulerService(testDb)
    await morphemeService.seedDatabaseIfEmpty()
  })

  afterEach(async () => {
    await testDb.delete()
  })

  it('應能正確獲取今日待學習/待複習之卡片', async () => {
    const dueCards = await scheduler.getDueCards(10)
    expect(dueCards.length).toBeGreaterThan(0)
    expect(dueCards[0].word).toBeDefined()
    expect(dueCards[0].cardState).toBeDefined()
  })

  it('對新單字評分 Good (3) 應推進學習狀態並記錄 ReviewLog 與 Outbox', async () => {
    const wordId = 'w_synchronize'
    const updated = await scheduler.reviewCard(wordId, 3)

    expect(updated.state).toBeGreaterThanOrEqual(1) // 進入 Learning 或 Review 狀態
    expect(updated.reps).toBe(1)
    expect(updated.syncStatus).toBe('pending')

    const logCount = await testDb.reviewLogs.where('wordId').equals(wordId).count()
    expect(logCount).toBe(1)

    const outboxCount = await testDb.outbox.count()
    expect(outboxCount).toBe(1)
  })

  it('評分 Easy (4) 應獲得較長的間隔天數與更高的穩定度', async () => {
    const wordIdEasy = 'w_predict'
    const wordIdHard = 'w_construct'

    const easyResult = await scheduler.reviewCard(wordIdEasy, 4)
    const hardResult = await scheduler.reviewCard(wordIdHard, 2)

    expect(easyResult.stability).toBeGreaterThan(hardResult.stability)
  })

  it('應支援 5 秒內 Undo 復原上一筆複習操作', async () => {
    const wordId = 'w_chronicle'
    const original = await testDb.cardStates.get(wordId)
    const originalReps = original?.reps ?? 0

    // 評分
    await scheduler.reviewCard(wordId, 3)
    let current = await testDb.cardStates.get(wordId)
    expect(current?.reps).toBe(originalReps + 1)

    // 執行 Undo
    const undoSuccess = await scheduler.undoLastReview()
    expect(undoSuccess).toBe(true)

    // 確認回到原始狀態
    current = await testDb.cardStates.get(wordId)
    expect(current?.reps).toBe(originalReps)

    const logCount = await testDb.reviewLogs.where('wordId').equals(wordId).count()
    expect(logCount).toBe(0)
  })

  it('應正確彙整全站學習進度統計', async () => {
    const stats = await scheduler.getLearningStats()
    expect(stats.totalWords).toBeGreaterThan(15)
    expect(stats.dueToday).toBeGreaterThan(0)
    expect(stats.totalReviews).toBe(0)

    // 複習一次
    await scheduler.reviewCard('w_synchronize', 3)
    const nextStats = await scheduler.getLearningStats()
    expect(nextStats.totalReviews).toBe(1)
  })

  it('應支援依主題方向篩選今日待學習卡片', async () => {
    const animCards = await scheduler.getDueCards(10, 'animation')
    expect(animCards.length).toBeGreaterThan(0)
    for (const c of animCards) {
      expect(c.word.topic).toBe('animation')
    }

    const sciCards = await scheduler.getDueCards(10, 'sci-fi')
    expect(sciCards.length).toBeGreaterThan(0)
    for (const c of sciCards) {
      expect(c.word.topic).toBe('sci-fi')
    }

    const dailyCards = await scheduler.getDueCards(10, 'daily')
    expect(dailyCards.length).toBeGreaterThan(0)
    for (const c of dailyCards) {
      expect(c.word.topic).toBe('daily')
    }
  })

  it('應支援每日學習設定持久化保存與讀取', () => {
    scheduler.saveDailySettings({
      targetNewCards: 20,
      preferredTopic: 'business',
      autoPlayAudio: false,
    })

    const retrieved = scheduler.getDailySettings()
    expect(retrieved.targetNewCards).toBe(20)
    expect(retrieved.preferredTopic).toBe('business')
    expect(retrieved.autoPlayAudio).toBe(false)
  })

  it('應支援切換星號生詞收藏狀態與專項篩選複習', async () => {
    const wordId = 'w_synchronize'
    // 初始狀態為未收藏
    let isStarred = await scheduler.isWordStarred(wordId)
    expect(isStarred).toBe(false)

    // 切換為收藏
    const starredState = await scheduler.toggleWordStar(wordId)
    expect(starredState).toBe(true)
    isStarred = await scheduler.isWordStarred(wordId)
    expect(isStarred).toBe(true)

    // 資料庫 getStarredWordIds 應包含該單字
    const starredList = await testDb.getStarredWordIds()
    expect(starredList).toContain(wordId)

    // 專項生詞本篩選 (onlyStarred = true) 應能正確拉取
    const starredDueCards = await scheduler.getDueCards(10, 'all', true)
    expect(starredDueCards.length).toBeGreaterThan(0)
    expect(starredDueCards.some((c) => c.word.id === wordId)).toBe(true)

    // 再次切換應取消收藏
    const unstarredState = await scheduler.toggleWordStar(wordId)
    expect(unstarredState).toBe(false)
    isStarred = await scheduler.isWordStarred(wordId)
    expect(isStarred).toBe(false)
  })
})
