// src/services/ttsService.ts
// 混合雙軌發音引擎：Web Speech API 本機優先 + 字典真人語音 Fallback 備援
export interface TTSOptions {
  rate?: number
  pitch?: number
  lang?: string
  accent?: 'us' | 'uk'
}

export class TTSService {
  private isSupported: boolean
  private currentAudio: HTMLAudioElement | null = null

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  // 嘗試透過二級真人字典音訊流播放 (解決 Android WebView 或未安裝 TTS 語音包之靜音問題)
  private playAudioFallback(text: string, options: TTSOptions): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') {
        resolve(false)
        return
      }

      try {
        this.stopAudio()
        const accentType = options.accent === 'uk' ? 1 : 0
        const cleanText = encodeURIComponent(text.trim())
        // 權威開源字典音訊 CDN (Type 0 = 美音, Type 1 = 英音)
        const audioUrl = `https://dict.youdao.com/dictvoice?type=${accentType}&audio=${cleanText}`

        const audio = new Audio(audioUrl)
        this.currentAudio = audio

        audio.onended = () => {
          this.currentAudio = null
          resolve(true)
        }

        audio.onerror = (err) => {
          console.warn('二級字典音訊備援播放失敗:', err)
          this.currentAudio = null
          resolve(false)
        }

        audio.play().catch((playErr) => {
          console.warn('音訊播放策略受限或離線:', playErr)
          this.currentAudio = null
          resolve(false)
        })
      } catch (err) {
        console.error('音訊備援執行異常:', err)
        resolve(false)
      }
    })
  }

  // 主播放入口：優先 Web Speech API，失敗時自動無縫降級至真人音訊
  async speak(text: string, options: TTSOptions = {}): Promise<boolean> {
    const trimmed = text.trim()
    if (!trimmed) return false

    // 若瀏覽器支援 speechSynthesis，先嘗試本機朗讀
    if (this.isSupported) {
      const speechSuccess = await new Promise<boolean>((resolve) => {
        try {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(trimmed)
          utterance.lang = options.lang || (options.accent === 'uk' ? 'en-GB' : 'en-US')
          utterance.rate = options.rate || 0.92 // 舒適學習語速
          utterance.pitch = options.pitch || 1.0

          let finished = false
          let timer: any = null

          utterance.onend = () => {
            if (!finished) {
              finished = true
              if (timer) clearTimeout(timer)
              resolve(true)
            }
          }

          utterance.onerror = (e) => {
            console.warn('SpeechSynthesis 發音異常，觸發二級音訊降級:', e)
            if (!finished) {
              finished = true
              if (timer) clearTimeout(timer)
              resolve(false)
            }
          }

          // 超時保護：若 4 秒內無反應則視為掛起，轉向備援
          timer = setTimeout(() => {
            if (!finished) {
              finished = true
              window.speechSynthesis.cancel()
              resolve(false)
            }
          }, 4000)

          window.speechSynthesis.speak(utterance)
          // 若 speak 後立即處於 paused 或未啟動狀態
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume()
          }
        } catch (err) {
          console.warn('SpeechSynthesis 執行失敗:', err)
          resolve(false)
        }
      })

      if (speechSuccess) {
        return true
      }
    }

    // 本機 TTS 不支援或執行失敗時，無縫調用真人音訊備援
    return await this.playAudioFallback(trimmed, options)
  }

  private stopAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      } catch {
        // 忽略中止異常
      }
      this.currentAudio = null
    }
  }

  stop(): void {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel()
      } catch {
        // 忽略
      }
    }
    this.stopAudio()
  }
}

export const ttsService = new TTSService()
