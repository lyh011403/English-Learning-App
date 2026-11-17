import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LexiClipDB } from '../db/lexiclipDatabase'
import { MorphemeService } from './morphemeService'

describe('T3: 詞根拆解與核心種子詞庫', () => {
  let testDb: LexiClipDB
  let service: MorphemeService

  beforeEach(async () => {
    testDb = new LexiClipDB(`test_morpheme_db_${Date.now()}`)
    service = new MorphemeService(testDb)
    await service.seedDatabaseIfEmpty()
  })

  afterEach(async () => {
    await testDb.delete()
  })

  it('應成功載入預設種子單字、詞根與片段', async () => {
    const wordCount = await testDb.words.count()
    const rootCount = await testDb.roots.count()
    const clipCount = await testDb.clips.count()

    expect(wordCount).toBeGreaterThan(15)
    expect(rootCount).toBeGreaterThan(10)
    expect(clipCount).toBeGreaterThan(2)
  })

  it('應精準拆解單字 synchronize 之詞根結構與附帶之影片片段', async () => {
    const detailed = await service.getWordWithMorphemes('synchronize')
    expect(detailed).toBeDefined()
    expect(detailed?.word).toBe('synchronize')

    // 驗證詞根拆解
    const morphemeTypes = detailed?.morphemes.map((m) => m.type)
    expect(morphemeTypes).toContain('prefix')
    expect(morphemeTypes).toContain('root')
    expect(morphemeTypes).toContain('suffix')

    // 驗證詞根意義與來源
    const rootChron = detailed?.morphemes.find((m) => m.morpheme === 'chron')
    expect(rootChron?.meaning).toBe('time')
    expect(rootChron?.meaningZh).toBe('時間')

    // 驗證影片片段關聯
    expect(detailed?.clips.length).toBeGreaterThan(0)
    expect(detailed?.clips[0].videoId).toBe('a3lcGnMhvsA')
  })

  it('應透過詞根 r_struct 反查全部同源詞家族', async () => {
    const family = await service.getMorphemeWithCognates('r_struct')
    expect(family).toBeDefined()
    expect(family?.morpheme).toBe('struct')

    const words = family?.cognateWords.map((w) => w.word)
    expect(words).toContain('construct')
    expect(words).toContain('destruction')
    expect(words).toContain('structure')
    expect(words).toContain('obstruct')
  })

  it('效能基準：連續 50 次單字與詞根查詢平均延遲應小於 50ms', async () => {
    const start = performance.now()
    const queries = ['synchronize', 'construct', 'predict', 'perspective', 'sympathy']

    for (let i = 0; i < 50; i++) {
      const q = queries[i % queries.length]
      await service.getWordWithMorphemes(q)
    }

    const duration = performance.now() - start
    const avgLatency = duration / 50

    expect(avgLatency).toBeLessThan(50)
  })

  it('應支援依主題方向過濾單字清單', async () => {
    const animWords = await service.getWordsByTopic('animation')
    expect(animWords.length).toBeGreaterThan(0)
    for (const w of animWords) {
      expect(w.topic).toBe('animation')
    }

    const businessWords = await service.getWordsByTopic('business')
    expect(businessWords.length).toBeGreaterThan(0)
    for (const w of businessWords) {
      expect(w.topic).toBe('business')
    }

    // 驗證生活日常 (daily) 專題與生活片段
    const dailyClips = await testDb.clips.where('topic').equals('daily').toArray()
    expect(dailyClips.length).toBeGreaterThanOrEqual(3)
    const clipTitles = dailyClips.map((c) => c.title)
    expect(clipTitles.some((t) => t.includes('Breakfast') || t.includes('Coffee'))).toBe(true)
  })
})
