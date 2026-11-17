import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LexiClipDB } from '../db/lexiclipDatabase'
import { SyncService } from './syncService'
import type { UserCardState, OutboxItem } from '../types/lexiclip'

describe('T7: Supabase 增量同步與離線佇列', () => {
  let testDb: LexiClipDB
  let syncService: SyncService

  beforeEach(() => {
    testDb = new LexiClipDB(`test_sync_db_${Date.now()}`)
    syncService = new SyncService(testDb)
  })

  afterEach(async () => {
    await testDb.delete()
  })

  it('離線狀態下應攔截同步並完整保留本機 Outbox 佇列', async () => {
    // 放入一筆待同步項目
    const item: OutboxItem = {
      id: 'outbox_test_1',
      entityType: 'review',
      entityId: 'w_synchronize',
      action: 'upsert',
      payload: JSON.stringify({ test: 123 }),
      createdAt: new Date().toISOString(),
      attempts: 0,
    }
    await testDb.outbox.put(item)

    // 模擬離線
    vi.stubGlobal('navigator', { onLine: false })

    const res = await syncService.syncOutboxBatch()
    expect(res.success).toBe(false)
    expect(res.error).toMatch(/離線狀態/)

    const pendingCount = await syncService.getPendingOutboxCount()
    expect(pendingCount).toBe(1)

    vi.unstubAllGlobals()
  })

  it('跨裝置合併卡片時，應採用最新時間戳 (LWW) 勝出機制', async () => {
    const localCard: UserCardState = {
      wordId: 'w_predict',
      state: 1,
      due: '2026-11-16T10:00:00.000Z',
      stability: 2,
      difficulty: 4,
      scheduled_days: 1,
      reps: 1,
      lapses: 0,
      syncStatus: 'synced',
      updatedAt: '2026-11-16T10:00:00.000Z',
    }
    await testDb.cardStates.put(localCard)

    // 模擬來自雲端的較新卡片狀態
    const remoteNewerCard: UserCardState = {
      wordId: 'w_predict',
      state: 2,
      due: '2026-11-20T10:00:00.000Z',
      stability: 5,
      difficulty: 3.5,
      scheduled_days: 4,
      reps: 2,
      lapses: 0,
      syncStatus: 'synced',
      updatedAt: '2026-11-16T12:00:00.000Z', // 較新時間
    }

    const updated = await syncService.mergeRemoteCards([remoteNewerCard])
    expect(updated).toBe(1)

    const finalCard = await testDb.cardStates.get('w_predict')
    expect(finalCard?.reps).toBe(2)
    expect(finalCard?.stability).toBe(5)
  })
})
