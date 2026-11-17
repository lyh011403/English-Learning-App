import { describe, it, expect, vi } from 'vitest'
import { dictionaryService } from './dictionaryService'

describe('線上辭典與即時詞根拆解服務', () => {
  it('應精準根據本地詞根庫拆解 synchronize', () => {
    const res = dictionaryService.decomposeMorphemes('synchronize')
    expect(res.rootIds).toContain('p_syn')
    expect(res.rootIds).toContain('r_chron')
    expect(res.rootIds).toContain('s_ize')
    expect(res.formula).toContain('syn-')
    expect(res.formula).toContain('chron')
  })

  it('應精準拆解 incredible 之詞根結構', () => {
    const res = dictionaryService.decomposeMorphemes('incredible')
    expect(res.rootIds).toContain('r_cred')
    expect(res.formula).toContain('cred')
  })

  it('線上查詞成功時應正確封裝為 WordEntry 並帶有語源公式', async () => {
    const mockApiResponse = [
      {
        word: 'serendipity',
        phonetic: '/ˌser.ənˈdɪp.ə.ti/',
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'the occurrence and development of events by chance in a happy or beneficial way',
                example: 'A fortunate stroke of serendipity.',
              },
            ],
          },
        ],
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      })
    )

    const res = await dictionaryService.lookupOnline('serendipity')
    expect(res.found).toBe(true)
    expect(res.entry).toBeDefined()
    expect(res.entry?.word).toBe('serendipity')
    expect(res.entry?.ipa).toBe('/ˌser.ənˈdɪp.ə.ti/')
    expect(res.entry?.pos).toContain('noun.')
    expect(res.entry?.levelTag).toBe('自訂生字本')

    vi.unstubAllGlobals()
  })
})
