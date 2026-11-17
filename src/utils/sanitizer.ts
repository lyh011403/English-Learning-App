export interface SanitizeWordResult {
  valid: boolean
  sanitized: string
  error?: string
}

export interface SanitizeClipResult {
  valid: boolean
  sanitized?: {
    videoId: string
    startSec: number
    endSec: number
    transcript: string
    title: string
  }
  error?: string
}

const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/
const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i

export function sanitizeWordInput(raw: string): SanitizeWordResult {
  if (!raw || typeof raw !== 'string') {
    return { valid: false, sanitized: '', error: '輸入不可為空' }
  }

  // 剝離控制字元與 HTML 標籤，正規化空白
  let cleaned = raw
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .replace(/\s+/g, ' ')

  if (cleaned.length === 0) {
    return { valid: false, sanitized: '', error: '輸入不可全為空白' }
  }

  if (cleaned.length > 64) {
    return { valid: false, sanitized: '', error: '單字長度不得超過 64 字元' }
  }

  // 僅允許標準英文單字、連字號、單引號與空白
  const validPattern = /^[A-Za-z\s'-]+$/
  if (!validPattern.test(cleaned)) {
    return { valid: false, sanitized: '', error: '單字僅能包含英文字母、連字號、單引號或空白' }
  }

  return { valid: true, sanitized: cleaned.toLowerCase() }
}

export function sanitizeClipInput(input: {
  videoId: string
  startSec: number
  endSec: number
  transcript: string
  title?: string
}): SanitizeClipResult {
  const { videoId, startSec, endSec, transcript, title = '' } = input

  if (!videoId || !YOUTUBE_VIDEO_ID_REGEX.test(videoId.trim())) {
    return { valid: false, error: '無效的 YouTube 影片代碼 (必須為 11 碼字串)' }
  }

  if (typeof startSec !== 'number' || typeof endSec !== 'number' || isNaN(startSec) || isNaN(endSec)) {
    return { valid: false, error: '時間戳必須為有效數值' }
  }

  if (startSec < 0) {
    return { valid: false, error: '起始時間不可小於 0 秒' }
  }

  if (endSec <= startSec) {
    return { valid: false, error: '結束時間必須大於起始時間' }
  }

  const duration = endSec - startSec
  if (duration > 120) {
    return { valid: false, error: '單一片段時長不得超過 120 秒' }
  }

  const cleanedTranscript = transcript
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()

  if (cleanedTranscript.length === 0) {
    return { valid: false, error: '字幕台詞文本不可為空' }
  }

  const cleanedTitle = (title || 'YouTube 片段')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 100)

  return {
    valid: true,
    sanitized: {
      videoId: videoId.trim(),
      startSec: Math.floor(startSec * 10) / 10,
      endSec: Math.ceil(endSec * 10) / 10,
      transcript: cleanedTranscript.slice(0, 1000),
      title: cleanedTitle,
    },
  }
}

export function sanitizeFileName(name: string): string {
  let cleaned = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim()
  if (WINDOWS_RESERVED_NAMES.test(cleaned)) {
    cleaned = `safe_${cleaned}`
  }
  return cleaned.slice(0, 120) || 'backup.json'
}
