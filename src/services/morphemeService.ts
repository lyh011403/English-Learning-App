import { db, LexiClipDB } from '../db/lexiclipDatabase'
import { SEED_ROOTS, SEED_WORDS, SEED_CLIPS } from '../data/seedData'
import type { WordEntry, RootMorpheme, MediaClip, UserCardState, LearningTopic } from '../types/lexiclip'

export interface DetailedWord extends WordEntry {
  morphemes: RootMorpheme[]
  clips: MediaClip[]
  cardState?: UserCardState
}

export interface DetailedMorpheme extends RootMorpheme {
  cognateWords: WordEntry[]
}

export class MorphemeService {
  private database: LexiClipDB

  constructor(database: LexiClipDB = db) {
    this.database = database
  }

  // 若資料庫為空或需要增量更新，載入種子資料
  async seedDatabaseIfEmpty(forceUpdate = false): Promise<boolean> {
    const wordCount = await this.database.words.count()
    if (wordCount >= SEED_WORDS.length && !forceUpdate) {
      return false
    }

    await this.database.transaction(
      'rw',
      this.database.words,
      this.database.roots,
      this.database.clips,
      this.database.cardStates,
      async () => {
        await this.database.roots.bulkPut(SEED_ROOTS)
        await this.database.words.bulkPut(SEED_WORDS)
        await this.database.clips.bulkPut(SEED_CLIPS)

        // 為尚未建立卡片狀態的新單字初始化 (FSRS state 0 = New)
        for (const w of SEED_WORDS) {
          const existing = await this.database.cardStates.get(w.id)
          if (!existing) {
            await this.database.cardStates.put({
              wordId: w.id,
              state: 0,
              due: new Date().toISOString(),
              stability: 0,
              difficulty: 0,
              scheduled_days: 0,
              reps: 0,
              lapses: 0,
              syncStatus: 'synced',
              updatedAt: new Date().toISOString(),
            })
          }
        }
      }
    )

    // 若環境支援 fetch 且單字庫小於 6500，背景自動加載全量 6668 詞庫 (含 2659 生活日常高頻詞)
    if (typeof fetch !== 'undefined') {
      this.database.words.count().then((count) => {
        if (count < 6500) {
          this.importChunkedVocab('master-lexicon.json').catch(() => {
            // 離線降級靜默處理
          })
        }
      })
    }

    return true
  }

  // 取得單字及拆解後的詞根與片段
  async getWordWithMorphemes(wordOrId: string): Promise<DetailedWord | null> {
    const normalized = wordOrId.trim().toLowerCase()
    let word = await this.database.words.get(normalized)
    if (!word) {
      word = await this.database.words.where('word').equals(normalized).first()
    }
    if (!word) {
      return null
    }

    // 取得關聯詞根與前綴/後綴
    const morphemes = await this.database.roots.where('id').anyOf(word.rootIds).toArray()

    // 取得關聯影音片段
    const clips = await this.database.clips.where('wordId').equals(word.id).toArray()

    // 取得學習狀態
    const cardState = await this.database.cardStates.get(word.id)

    return {
      ...word,
      morphemes,
      clips,
      cardState,
    }
  }

  // 取得詞根及其同源詞家族
  async getMorphemeWithCognates(morphemeId: string): Promise<DetailedMorpheme | null> {
    const root = await this.database.roots.get(morphemeId)
    if (!root) {
      return null
    }

    const cognateWords = await this.database.words
      .where('id')
      .anyOf(root.cognateWordIds)
      .toArray()

    return {
      ...root,
      cognateWords,
    }
  }

  // 依主題方向取得單字列表
  async getWordsByTopic(topic: LearningTopic): Promise<WordEntry[]> {
    if (topic === 'all') {
      return await this.database.words.toArray()
    }
    return await this.database.words.where('topic').equals(topic).toArray()
  }

  // 一鍵加入自訂生字本 (供線上查詞結果或自訂輸入收錄)
  async addCustomWord(entry: WordEntry): Promise<void> {
    await this.database.transaction('rw', this.database.words, this.database.cardStates, async () => {
      await this.database.words.put(entry)
      const existing = await this.database.cardStates.get(entry.id)
      if (!existing) {
        await this.database.cardStates.put({
          wordId: entry.id,
          state: 0,
          due: new Date().toISOString(),
          stability: 0,
          difficulty: 0,
          scheduled_days: 0,
          reps: 0,
          lapses: 0,
          syncStatus: 'pending',
          updatedAt: new Date().toISOString(),
        })
      }
    })
  }

  // 匯入分片詞庫 JSON (如 toefl-core.json, master-lexicon.json)
  async importChunkedVocab(filename: string): Promise<number> {
    // 於測試環境中略過靜態檔案 fetch
    if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test') {
      return 0
    }
    try {
      let targetUrl = `/vocab/${filename}`
      if (typeof window !== 'undefined' && window.location?.origin && window.location.origin.startsWith('http')) {
        targetUrl = new URL(`/vocab/${filename}`, window.location.origin).toString()
      }
      const res = await fetch(targetUrl)
      if (!res.ok) {
        throw new Error(`無法載入詞庫檔案: ${filename}`)
      }
      const words: WordEntry[] = await res.json()
      if (!Array.isArray(words) || words.length === 0) {
        return 0
      }

      await this.database.transaction('rw', this.database.words, this.database.cardStates, async () => {
        await this.database.words.bulkPut(words)
        for (const w of words) {
          const exists = await this.database.cardStates.get(w.id)
          if (!exists) {
            await this.database.cardStates.put({
              wordId: w.id,
              state: 0,
              due: new Date().toISOString(),
              stability: 0,
              difficulty: 0,
              scheduled_days: 0,
              reps: 0,
              lapses: 0,
              syncStatus: 'synced',
              updatedAt: new Date().toISOString(),
            })
          }
        }
      })
      return words.length
    } catch (err) {
      console.error('匯入分片詞庫失敗:', err)
      throw err
    }
  }

  // 高性能前綴索引 + 語意模糊搜尋 (可選限定主題)
  async searchWordsAndRoots(
    query: string,
    topic: LearningTopic = 'all'
  ): Promise<{
    words: WordEntry[]
    roots: RootMorpheme[]
  }> {
    const q = query.trim().toLowerCase()
    if (!q) {
      return { words: [], roots: [] }
    }

    let matchedWords: WordEntry[] = []

    // 1. 若為純英文字符，優先走 Dexie 前綴索引 (startsWithIgnoreCase) 毫秒級直出
    if (/^[a-z]+$/i.test(q)) {
      const indexed = await this.database.words
        .where('word')
        .startsWithIgnoreCase(q)
        .limit(10)
        .toArray()

      matchedWords = topic === 'all' ? indexed : indexed.filter((w) => w.topic === topic)
    }

    // 2. 若索引結果不足 10 筆或為中文檢索，進行補足過濾
    if (matchedWords.length < 10) {
      const needed = 10 - matchedWords.length
      const existingIds = new Set(matchedWords.map((w) => w.id))
      const fallback = await this.database.words
        .filter((w) => {
          if (existingIds.has(w.id)) return false
          const matchesTopic = topic === 'all' || w.topic === topic
          const matchesQuery =
            w.word.toLowerCase().includes(q) ||
            w.meaningsZh.some((m) => m.includes(q)) ||
            (w.mnemonic && w.mnemonic.toLowerCase().includes(q))
          return matchesTopic && Boolean(matchesQuery)
        })
        .limit(needed)
        .toArray()

      matchedWords = [...matchedWords, ...fallback]
    }

    const roots = await this.database.roots
      .filter((r) => r.morpheme.toLowerCase().includes(q) || r.meaningZh.includes(q))
      .limit(10)
      .toArray()

    return { words: matchedWords, roots }
  }
}

export const morphemeService = new MorphemeService()
