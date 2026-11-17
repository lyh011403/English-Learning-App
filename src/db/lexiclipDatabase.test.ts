import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LexiClipDB } from './lexiclipDatabase'
import { sanitizeWordInput, sanitizeClipInput, sanitizeFileName } from '../utils/sanitizer'
import type { UserCardState, ReviewLog } from '../types/lexiclip'

describe('T2: 輸入洗滌與離線資料層', () => {
  let testDb: LexiClipDB

  beforeEach(() => {
    testDb = new LexiClipDB(`test_db_${Date.now()}`)
  })

  afterEach(async () => {
    await testDb.delete()
  })

  describe('單字輸入洗滌器', () => {
    it('應正常過濾控制字元、HTML 標籤並轉為小寫', () => {
      const res = sanitizeWordInput('  <b> Synchronize </b> \t\n')
      expect(res.valid).toBe(true)
      expect(res.sanitized).toBe('synchronize')
    })

    it('應攔截帶有數字或程式碼括號的注入輸入', () => {
      const res = sanitizeWordInput('<script>alert(1)</script>')
      expect(res.valid).toBe(false)
      expect(res.error).toMatch(/單字僅能包含英文字母/)
    })

    it('合法單字應直接通過', () => {
      const res = sanitizeWordInput("mother-in-law")
      expect(res.valid).toBe(true)
      expect(res.sanitized).toBe('mother-in-law')
    })

    it('應攔截空字串或超過 64 字元的異常輸入', () => {
      expect(sanitizeWordInput('').valid).toBe(false)
      expect(sanitizeWordInput('   ').valid).toBe(false)
      expect(sanitizeWordInput('a'.repeat(65)).valid).toBe(false)
    })

    it('應攔截含有特殊標點符號的非英文輸入', () => {
      expect(sanitizeWordInput('word@123!').valid).toBe(false)
    })
  })

  describe('YouTube 片段時間軸驗證器', () => {
    it('應驗證通過合法的 11 碼 videoId 與時間區段', () => {
      const res = sanitizeClipInput({
        videoId: 'dQw4w9WgXcQ',
        startSec: 12.34,
        endSec: 25.67,
        transcript: 'Never gonna give you up',
        title: 'Rick Astley Clip',
      })
      expect(res.valid).toBe(true)
      expect(res.sanitized?.videoId).toBe('dQw4w9WgXcQ')
      expect(res.sanitized?.startSec).toBe(12.3)
      expect(res.sanitized?.endSec).toBe(25.7)
    })

    it('應攔截 endSec 小於或等於 startSec 的無效時間軸', () => {
      const res = sanitizeClipInput({
        videoId: 'dQw4w9WgXcQ',
        startSec: 20,
        endSec: 15,
        transcript: 'Invalid time',
      })
      expect(res.valid).toBe(false)
      expect(res.error).toMatch(/結束時間必須大於起始時間/)
    })

    it('應攔截超過 120 秒的過長片段', () => {
      const res = sanitizeClipInput({
        videoId: 'dQw4w9WgXcQ',
        startSec: 0,
        endSec: 150,
        transcript: 'Too long',
      })
      expect(res.valid).toBe(false)
      expect(res.error).toMatch(/單一片段時長不得超過/)
    })

    it('應過濾 Windows 敏感保留字與檔名特殊符號', () => {
      expect(sanitizeFileName('CON.json')).toBe('safe_CON.json')
      expect(sanitizeFileName('my<test>:file?.json')).toBe('my_test__file_.json')
    })
  })

  describe('IndexedDB 離線資料層與事務', () => {
    it('應原子性寫入卡片狀態與複習日誌', async () => {
      const cardState: UserCardState = {
        wordId: 'w_synchronize',
        state: 1,
        due: new Date().toISOString(),
        stability: 2.5,
        difficulty: 4.8,
        scheduled_days: 1,
        reps: 1,
        lapses: 0,
        syncStatus: 'pending',
        updatedAt: new Date().toISOString(),
      }

      const reviewLog: ReviewLog = {
        id: 'rev_1',
        wordId: 'w_synchronize',
        rating: 3,
        review: new Date().toISOString(),
        state: 1,
        due: cardState.due,
        stability: 2.5,
        difficulty: 4.8,
        scheduled_days: 1,
        idempotencyKey: 'idem_key_1',
      }

      await testDb.recordReviewAtomic(cardState, reviewLog)

      const savedCard = await testDb.cardStates.get('w_synchronize')
      const savedLog = await testDb.reviewLogs.get('rev_1')

      expect(savedCard).toBeDefined()
      expect(savedCard?.wordId).toBe('w_synchronize')
      expect(savedLog).toBeDefined()
      expect(savedLog?.rating).toBe(3)
    })

    it('應支援軟刪除與一鍵復原', async () => {
      const cardState: UserCardState = {
        wordId: 'w_chronicle',
        state: 0,
        due: new Date().toISOString(),
        stability: 1,
        difficulty: 5,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        syncStatus: 'synced',
        updatedAt: new Date().toISOString(),
      }
      await testDb.cardStates.put(cardState)

      // 軟刪除
      await testDb.softDeleteCard('w_chronicle')
      let item = await testDb.cardStates.get('w_chronicle')
      expect(item?.deletedAt).toBeDefined()

      // 復原
      await testDb.restoreCard('w_chronicle')
      item = await testDb.cardStates.get('w_chronicle')
      expect(item?.deletedAt).toBeUndefined()
    })

    it('應支援切換星號生詞收藏與取得所有收藏單字 ID', async () => {
      // 初始無收藏
      let starredIds = await testDb.getStarredWordIds()
      expect(starredIds).not.toContain('w_star_test')

      // 收藏單字
      const isStarred = await testDb.toggleStar('w_star_test')
      expect(isStarred).toBe(true)

      const card = await testDb.cardStates.get('w_star_test')
      expect(card?.starred).toBe(1)

      starredIds = await testDb.getStarredWordIds()
      expect(starredIds).toContain('w_star_test')

      // 取消收藏
      const isStarredAfter = await testDb.toggleStar('w_star_test')
      expect(isStarredAfter).toBe(false)

      starredIds = await testDb.getStarredWordIds()
      expect(starredIds).not.toContain('w_star_test')
    })
  })
})
