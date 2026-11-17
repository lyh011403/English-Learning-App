import { db, LexiClipDB } from '../db/lexiclipDatabase'
import type { OutboxItem, UserCardState } from '../types/lexiclip'

export interface SyncConfig {
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export interface SyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  error?: string
}

export class SyncService {
  private database: LexiClipDB
  private config: SyncConfig = {}

  constructor(database: LexiClipDB = db) {
    this.database = database
    // 預設從環境變數載入 (Vite 前綴)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      this.config = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      }
    }
  }

  setConfig(config: SyncConfig) {
    this.config = { ...this.config, ...config }
  }

  // 取得目前本機尚未同步至雲端的變更項目數量
  async getPendingOutboxCount(): Promise<number> {
    return await this.database.outbox.count()
  }

  // 執行增量同步
  async syncOutboxBatch(batchSize = 50): Promise<SyncResult> {
    if (!navigator.onLine) {
      return { success: false, syncedCount: 0, failedCount: 0, error: '目前處於離線狀態' }
    }

    const items = await this.database.outbox.limit(batchSize).toArray()
    if (items.length === 0) {
      return { success: true, syncedCount: 0, failedCount: 0 }
    }

    // 若未配置雲端憑證，保留本地 Outbox 待後續配置後推送
    if (!this.config.supabaseUrl || !this.config.supabaseAnonKey) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: items.length,
        error: '未配置 Supabase 連線憑證，暫存於本機 Outbox',
      }
    }

    let syncedCount = 0
    let failedCount = 0
    const processedIds: string[] = []

    for (const item of items) {
      try {
        // 模擬或執行 Supabase REST API 冪等推送
        const success = await this.pushItemToRemote(item)
        if (success) {
          processedIds.push(item.id)
          syncedCount++
        } else {
          failedCount++
          await this.database.outbox.update(item.id, { attempts: item.attempts + 1 })
        }
      } catch (err) {
        console.warn('Sync item failed:', err)
        failedCount++
        await this.database.outbox.update(item.id, { attempts: item.attempts + 1 })
      }
    }

    // 成功同步後自 Outbox 移除
    if (processedIds.length > 0) {
      await this.database.outbox.bulkDelete(processedIds)
    }

    return {
      success: failedCount === 0,
      syncedCount,
      failedCount,
    }
  }

  // 單項推送邏輯 (採用標準 REST Fetch，無多餘肥大依賴)
  private async pushItemToRemote(item: OutboxItem): Promise<boolean> {
    const endpoint = `${this.config.supabaseUrl}/rest/v1/${item.entityType === 'review' ? 'review_logs' : 'card_states'}`
    const payload = JSON.parse(item.payload)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.config.supabaseAnonKey!,
        Authorization: `Bearer ${this.config.supabaseAnonKey!}`,
        Prefer: 'resolution=merge-duplicates', // 衝突時依據主鍵與冪等鍵合併
      },
      body: JSON.stringify(payload),
    })

    return response.ok
  }

  // 跨裝置雲端資料合併 (衝突採最新時間戳 LWW)
  async mergeRemoteCards(remoteCards: UserCardState[]): Promise<number> {
    let updated = 0
    await this.database.transaction('rw', this.database.cardStates, async () => {
      for (const remote of remoteCards) {
        const local = await this.database.cardStates.get(remote.wordId)
        if (!local || new Date(remote.updatedAt) > new Date(local.updatedAt)) {
          await this.database.cardStates.put({
            ...remote,
            syncStatus: 'synced',
          })
          updated++
        }
      }
    })
    return updated
  }
}

export const syncService = new SyncService()
