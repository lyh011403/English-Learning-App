export type MorphemeType = 'prefix' | 'root' | 'suffix'

export type LearningTopic = 'all' | 'daily' | 'animation' | 'sci-fi' | 'cinema' | 'sitcom' | 'business'

export interface RootMorpheme {
  id: string
  morpheme: string
  type: MorphemeType
  origin: string
  meaning: string
  meaningZh: string
  cognateWordIds: string[]
}

export interface WordExample {
  en: string
  zh: string
}

export interface WordEntry {
  id: string
  word: string
  ipa?: string
  pos: string[]
  meanings: string[]
  meaningsZh: string[]
  rootIds: string[]
  levelTag: string
  topic: LearningTopic
  mnemonic?: string
  examples?: WordExample[]
  primaryClipId?: string
}

export interface MediaClip {
  id: string
  wordId: string
  videoId: string
  title: string
  sourceName?: string
  topic: LearningTopic
  startSec: number
  endSec: number
  transcript: string
  transcriptZh: string
  localVideoUrl?: string
  status: 'active' | 'unplayable'
}

export interface UserCardState {
  wordId: string
  state: number
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps?: number
  reps: number
  lapses: number
  last_review?: string
  starred?: number // 1: 已收藏星號生詞, 0 或 undefined: 未收藏
  syncStatus: 'synced' | 'pending'
  updatedAt: string
  deletedAt?: string
}

export interface ReviewLog {
  id: string
  wordId: string
  rating: 1 | 2 | 3 | 4
  review: string
  state: number
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps?: number
  idempotencyKey: string
}

export interface OutboxItem {
  id: string
  entityType: 'card' | 'review' | 'custom_word'
  entityId: string
  action: 'upsert' | 'delete'
  payload: string
  createdAt: string
  attempts: number
}

export interface DailyGoalSetting {
  targetNewCards: number
  preferredTopic: LearningTopic
  autoPlayAudio: boolean
}
