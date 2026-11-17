import type { WordEntry, WordExample } from '../types/lexiclip'
import { SEED_ROOTS } from '../data/seedData'

export interface FreeDictMeaning {
  partOfSpeech: string
  definitions: {
    definition: string
    example?: string
    synonyms?: string[]
    antonyms?: string[]
  }[]
}

export interface FreeDictResponse {
  word: string
  phonetic?: string
  phonetics?: { text?: string; audio?: string }[]
  meanings: FreeDictMeaning[]
}

export interface OnlineWordResult {
  found: boolean
  entry?: WordEntry
  audioUrl?: string
  error?: string
}

export class DictionaryService {
  // 自動比對本地詞根庫，找出匹配的前綴、字根、後綴
  decomposeMorphemes(word: string): { rootIds: string[]; formula: string } {
    const w = word.toLowerCase().trim()
    const matchedRootIds: string[] = []
    const parts: string[] = []

    for (const root of SEED_ROOTS) {
      // 處理多個變形，例如 "syn- / sym-", "-ize / -ise"
      const variants = root.morpheme
        .split(/[/,]/)
        .map((v) => v.replace(/[-/\s]/g, '').toLowerCase())
        .filter((v) => v.length >= 2)

      const isMatch = variants.some((v) => {
        if (root.type === 'prefix') return w.startsWith(v)
        if (root.type === 'suffix') return w.endsWith(v)
        return w.includes(v)
      })

      if (isMatch) {
        matchedRootIds.push(root.id)
        parts.push(`${root.morpheme}(${root.meaningZh})`)
      }
    }

    const formula = parts.length > 0 ? parts.join(' + ') : `${w} (基礎詞源)`
    return { rootIds: Array.from(new Set(matchedRootIds)), formula }
  }

  // 查詢 Free Dictionary API (帶 5 秒超時)
  async lookupOnline(rawWord: string): Promise<OnlineWordResult> {
    const word = rawWord.trim().toLowerCase()
    if (!word) {
      return { found: false, error: '查詢單字不可為空' }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      const res = await fetch(url, { signal: controller.signal })

      if (!res.ok) {
        return { found: false, error: '線上辭典查無此字或網路無法連線' }
      }

      const data: FreeDictResponse[] = await res.json()
      if (!Array.isArray(data) || data.length === 0) {
        return { found: false, error: '查無單字資料' }
      }

      const first = data[0]
      const ipa = first.phonetic || first.phonetics?.find((p) => p.text)?.text || ''
      const audioUrl = first.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio || ''

      const posList: string[] = []
      const meaningsEn: string[] = []
      const examples: WordExample[] = []

      for (const m of first.meanings || []) {
        if (m.partOfSpeech && !posList.includes(m.partOfSpeech)) {
          posList.push(m.partOfSpeech)
        }
        for (const d of m.definitions.slice(0, 2)) {
          meaningsEn.push(d.definition)
          if (d.example) {
            examples.push({ en: d.example, zh: '（情境造句範例）' })
          }
        }
      }

      // 自動執行語源拆解
      const { rootIds, formula } = this.decomposeMorphemes(word)

      const entry: WordEntry = {
        id: `w_custom_${word}_${Date.now()}`,
        word,
        ipa,
        pos: posList.map((p) => `${p}.`),
        meanings: meaningsEn.slice(0, 3),
        meaningsZh: [`【線上收錄釋義】${meaningsEn[0] || '暫無中文釋義'}`],
        rootIds,
        levelTag: '自訂生字本',
        topic: 'all',
        mnemonic: `語源拆解：${formula}`,
        examples: examples.slice(0, 2),
      }

      return {
        found: true,
        entry,
        audioUrl,
      }
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError'
      return {
        found: false,
        error: isAbort ? '查詢請求逾時' : '線上辭典連線異常，已退守離線模式',
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const dictionaryService = new DictionaryService()
