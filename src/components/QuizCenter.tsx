import React, { useState, useEffect, useCallback } from 'react'
import {
  Brain,
  Volume2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { db } from '../db/lexiclipDatabase'
import { SEED_WORDS, SEED_ROOTS } from '../data/seedData'
import type { WordEntry, LearningTopic, RootMorpheme } from '../types/lexiclip'
import { ttsService } from '../services/ttsService'
import { fsrsScheduler } from '../services/fsrsScheduler'

export type QuizType =
  | 'en_to_zh'
  | 'zh_to_en'
  | 'morpheme_assembly'
  | 'audio_listening'
  | 'sentence_cloze'

export interface QuizQuestion {
  id: string
  type: QuizType
  targetWord: WordEntry
  prompt: string
  subPrompt?: string
  options?: string[]
  correctAnswer: string
  assemblyTiles?: { id: string; text: string }[]
  targetTokens?: string[]
  explanation: string
}

export interface QuizCenterProps {
  onNavigateToStudy?: () => void
}

function playFeedbackSound(isCorrect: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    if (isCorrect) {
      // 答對微音效 (清脆上升雙音)
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, now)
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12)
      gain1.gain.setValueAtTime(0.12, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.2)
    } else {
      // 答錯低音提示
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(175, now + 0.15)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.25)
    }
  } catch {
    // 忽略受限音訊
  }
}

export const QuizCenter: React.FC<QuizCenterProps> = ({ onNavigateToStudy }) => {
  // 詞庫載入狀態
  const [allWords, setAllWords] = useState<WordEntry[]>([])
  const [allRoots, setAllRoots] = useState<RootMorpheme[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // 測驗設定與流程狀態
  const [stage, setStage] = useState<'config' | 'playing' | 'summary'>('config')
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic>('all')
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<'all' | 'vocab' | 'roots' | 'listening'>('all')

  // 測驗進行中狀態
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [mistakes, setMistakes] = useState<{ question: QuizQuestion; userAnswer: string }[]>([])
  const [fsrsSyncing, setFsrsSyncing] = useState<boolean>(false)
  const [fsrsSyncedCount, setFsrsSyncedCount] = useState<number | null>(null)

  // 詞根拼裝專屬狀態
  const [assembledTiles, setAssembledTiles] = useState<{ id: string; text: string }[]>([])

  // 載入詞庫與詞根
  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const dbWords = await db.words.toArray()
        const dbRoots = await db.roots.toArray()
        if (isMounted) {
          setAllWords(dbWords.length > 0 ? dbWords : SEED_WORDS)
          setAllRoots(dbRoots.length > 0 ? dbRoots : SEED_ROOTS)
          setLoading(false)
        }
      } catch (err) {
        console.error('載入詞庫失敗，降級使用種子資料:', err)
        if (isMounted) {
          setAllWords(SEED_WORDS)
          setAllRoots(SEED_ROOTS)
          setLoading(false)
        }
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // 題目生成演算法
  const generateQuizQuestions = useCallback(
    (count: number, topic: LearningTopic, category: 'all' | 'vocab' | 'roots' | 'listening'): QuizQuestion[] => {
      // 根據主題篩選備選池
      const pool = allWords.filter((w) => topic === 'all' || w.topic === topic)
      if (pool.length < 4) {
        return []
      }

      // 洗牌抽樣目標單字
      const shuffledWords = [...pool].sort(() => Math.random() - 0.5)
      const selectedWords = shuffledWords.slice(0, Math.min(count, shuffledWords.length))

      const generated: QuizQuestion[] = []

      selectedWords.forEach((word, idx) => {
        // 決定題型
        let availableTypes: QuizType[] = []
        if (category === 'vocab') {
          availableTypes = ['en_to_zh', 'zh_to_en']
        } else if (category === 'roots') {
          availableTypes = ['morpheme_assembly']
        } else if (category === 'listening') {
          availableTypes = ['audio_listening', 'sentence_cloze']
        } else {
          availableTypes = ['en_to_zh', 'zh_to_en', 'audio_listening', 'sentence_cloze']
          if (word.rootIds && word.rootIds.length > 0) {
            availableTypes.push('morpheme_assembly')
          }
        }

        const pickedType: QuizType = availableTypes[Math.floor(Math.random() * availableTypes.length)]

        // 抽取 3 個干擾項 (非當前單字)
        const distractors = pool.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3)

        if (pickedType === 'en_to_zh') {
          const correctZh = word.meaningsZh[0] || word.meanings[0]
          const options = [correctZh, ...distractors.map((d) => d.meaningsZh[0] || d.meanings[0])].sort(
            () => Math.random() - 0.5
          )
          generated.push({
            id: `q_${idx}_${word.id}`,
            type: 'en_to_zh',
            targetWord: word,
            prompt: word.word,
            subPrompt: word.ipa ? `[ ${word.ipa} ]  ${word.pos.join(' ')}` : word.pos.join(' '),
            options,
            correctAnswer: correctZh,
            explanation: `${word.word} (${word.pos.join(', ')})：${correctZh}。${word.mnemonic ? '詞根助記：' + word.mnemonic : ''}`,
          })
        } else if (pickedType === 'zh_to_en') {
          const correctZh = word.meaningsZh[0] || word.meanings[0]
          const options = [word.word, ...distractors.map((d) => d.word)].sort(() => Math.random() - 0.5)
          generated.push({
            id: `q_${idx}_${word.id}`,
            type: 'zh_to_en',
            targetWord: word,
            prompt: correctZh,
            subPrompt: `詞性：${word.pos.join(' ')}  ·  主題：${word.topic}`,
            options,
            correctAnswer: word.word,
            explanation: `${word.word}：${correctZh}。例句：${word.examples && word.examples[0] ? word.examples[0].en : ''}`,
          })
        } else if (pickedType === 'audio_listening') {
          const options = [word.word, ...distractors.map((d) => d.word)].sort(() => Math.random() - 0.5)
          generated.push({
            id: `q_${idx}_${word.id}`,
            type: 'audio_listening',
            targetWord: word,
            prompt: '點擊語音播放，選出聽到的單字：',
            subPrompt: `詞性：${word.pos.join(' ')}`,
            options,
            correctAnswer: word.word,
            explanation: `正確單字為 ${word.word} [${word.ipa || ''}]，釋義：${word.meaningsZh.join('、')}。`,
          })
        } else if (pickedType === 'sentence_cloze') {
          const example = word.examples && word.examples[0] ? word.examples[0] : null
          const sentence = example ? example.en : `The concept of ${word.word} is vital in modern practice.`
          const clozePrompt = sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '[ ________ ]')
          const options = [word.word, ...distractors.map((d) => d.word)].sort(() => Math.random() - 0.5)

          generated.push({
            id: `q_${idx}_${word.id}`,
            type: 'sentence_cloze',
            targetWord: word,
            prompt: clozePrompt,
            subPrompt: example ? example.zh : word.meaningsZh.join('、'),
            options,
            correctAnswer: word.word,
            explanation: `填空正解：${word.word}。整句中譯：${example ? example.zh : word.meaningsZh[0]}`,
          })
        } else if (pickedType === 'morpheme_assembly') {
          // 詞根拼裝題：解析詞根關聯或分割
          // 取得該字對應的詞根實體
          const matchedRoots = allRoots.filter((r) => word.rootIds.includes(r.id))
          let tokens: string[] = []

          if (matchedRoots.length >= 2) {
            tokens = matchedRoots.map((r) => r.morpheme.split('/')[0].trim().replace(/[-]/g, ''))
          } else {
            // 自動均分成 2~3 段音節
            const len = word.word.length
            const mid = Math.floor(len / 2)
            tokens = [word.word.slice(0, mid), word.word.slice(mid)]
          }

          // 加入 2 個隨機干擾磁貼
          const randomDistractorRoots = allRoots
            .filter((r) => !word.rootIds.includes(r.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
            .map((r) => r.morpheme.split('/')[0].trim().replace(/[-]/g, ''))

          const tiles = [...tokens, ...randomDistractorRoots]
            .sort(() => Math.random() - 0.5)
            .map((t, tIdx) => ({ id: `tile_${tIdx}_${t}`, text: t }))

          generated.push({
            id: `q_${idx}_${word.id}`,
            type: 'morpheme_assembly',
            targetWord: word,
            prompt: `依序點擊詞根磁貼，拼裝出目標單字：`,
            subPrompt: `釋義：${word.meaningsZh[0]} (${word.pos.join(' ')})`,
            assemblyTiles: tiles,
            targetTokens: tokens,
            correctAnswer: word.word,
            explanation: `正解拼法：${word.word}。詞根分解：${word.mnemonic || '拉丁/希臘字源構詞'}`,
          })
        }
      })

      return generated
    },
    [allWords, allRoots]
  )

  // 開始測驗
  const handleStartQuiz = () => {
    const list = generateQuizQuestions(questionCount, selectedTopic, selectedQuizCategory)
    if (list.length === 0) {
      alert('該主題下的單字量不足以構成測驗，請切換為「全部主題」！')
      return
    }
    setQuestions(list)
    setCurrentIndex(0)
    setScore(0)
    setMistakes([])
    setSelectedAnswer(null)
    setIsAnswered(false)
    setAssembledTiles([])
    setFsrsSyncedCount(null)
    setStage('playing')

    // 若第一題為語音題，自動朗讀發音
    if (list[0].type === 'audio_listening') {
      setTimeout(() => {
        ttsService.speak(list[0].targetWord.word)
      }, 300)
    }
  }

  // 選擇選項
  const handleSelectOption = (option: string) => {
    if (isAnswered) return
    setSelectedAnswer(option)
    const currentQ = questions[currentIndex]
    const correct = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      setScore((prev) => prev + 1)
    } else {
      setMistakes((prev) => [...prev, { question: currentQ, userAnswer: option }])
    }
    playFeedbackSound(correct)
  }

  // 詞根磁貼點擊
  const handleTileClick = (tile: { id: string; text: string }) => {
    if (isAnswered) return
    setAssembledTiles((prev) => [...prev, tile])
  }

  // 移除已拼磁貼
  const handleRemoveTile = (index: number) => {
    if (isAnswered) return
    setAssembledTiles((prev) => prev.filter((_, i) => i !== index))
  }

  // 提交詞根拼裝答案
  const handleSubmitAssembly = () => {
    if (isAnswered) return
    const currentQ = questions[currentIndex]
    const assembledWord = assembledTiles.map((t) => t.text).join('')
    setSelectedAnswer(assembledWord)

    const correct = assembledWord.toLowerCase() === currentQ.correctAnswer.toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      setScore((prev) => prev + 1)
    } else {
      setMistakes((prev) => [...prev, { question: currentQ, userAnswer: assembledWord || '(未拼裝)' }])
    }
    playFeedbackSound(correct)
  }

  // 測驗鍵盤快捷鍵 (1-4/A-D 選擇, Space/Enter 下一題)
  useEffect(() => {
    if (stage !== 'playing') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      const currentQ = questions[currentIndex]
      if (!currentQ) return

      // 若已作答，按 Space 或 Enter 進入下一題
      if (isAnswered) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault()
          handleNextQuestion()
        }
        return
      }

      // 選擇題快捷鍵 (1/2/3/4 或 A/B/C/D)
      if (currentQ.type !== 'morpheme_assembly' && currentQ.options) {
        let optIndex = -1
        if (e.key === '1' || e.key.toLowerCase() === 'a') optIndex = 0
        else if (e.key === '2' || e.key.toLowerCase() === 'b') optIndex = 1
        else if (e.key === '3' || e.key.toLowerCase() === 'c') optIndex = 2
        else if (e.key === '4' || e.key.toLowerCase() === 'd') optIndex = 3

        if (optIndex >= 0 && optIndex < currentQ.options.length) {
          e.preventDefault()
          handleSelectOption(currentQ.options[optIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stage, isAnswered, currentIndex, questions])

  // 下一題
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setAssembledTiles([])

      if (questions[nextIdx].type === 'audio_listening') {
        setTimeout(() => {
          ttsService.speak(questions[nextIdx].targetWord.word)
        }, 300)
      }
    } else {
      setStage('summary')
    }
  }

  // 一鍵將錯題加入 FSRS 複習系統
  const handleSyncMistakesToFSRS = async () => {
    if (mistakes.length === 0 || fsrsSyncing) return
    setFsrsSyncing(true)
    try {
      let count = 0
      for (const m of mistakes) {
        // rating 1 = Again (即刻排入記憶曲線複習)
        await fsrsScheduler.reviewCard(m.question.targetWord.id, 1)
        count++
      }
      setFsrsSyncedCount(count)
    } catch (err) {
      console.error('錯題寫入 FSRS 失敗:', err)
      alert('錯題寫入排程失敗，請稍後再試。')
    } finally {
      setFsrsSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-[#5C6D70]">
        載入題庫大數據中...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 頂部標頭 */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#10262C]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#10262C] px-2.5 py-0.5 text-xs font-semibold text-[#F8F9F6]">
              Quiz Center
            </span>
            <h1 className="text-xl font-bold text-[#10262C]">智能練習題測驗中心</h1>
          </div>
          <p className="mt-1 text-xs text-[#5C6D70]">
            基於本機 {allWords.length} 個真實單字與 105 個詞根，演算法動態組配無窮題庫。錯題一鍵對接 FSRS 記憶曲線。
          </p>
        </div>

        {stage !== 'config' && (
          <button
            onClick={() => setStage('config')}
            className="flex items-center gap-1 self-start rounded-[4px] border border-[#10262C]/20 bg-[#F8F9F6] px-3 py-1.5 text-xs font-medium text-[#10262C] hover:bg-[#E9ECE5] transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重設條件
          </button>
        )}
      </div>

      {/* 階段 1：測驗設定面板 */}
      {stage === 'config' && (
        <div className="space-y-6">
          {/* 模式挑選卡片 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              onClick={() => setQuestionCount(10)}
              className={`cursor-pointer rounded-[8px] border p-4 transition-all ${
                questionCount === 10
                  ? 'border-[#10262C] bg-[#E9ECE5]/60 shadow-sm'
                  : 'border-[#10262C]/10 bg-[#F8F9F6] hover:border-[#10262C]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#10262C]">快速快問快答</span>
                <span className="rounded-[2px] bg-[#10262C]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#10262C]">
                  10 題
                </span>
              </div>
              <p className="mt-2 text-xs text-[#5C6D70]">
                耗時約 2~3 分鐘，適合零碎時間熱身檢測日常詞彙敏銳度。
              </p>
            </div>

            <div
              onClick={() => setQuestionCount(20)}
              className={`cursor-pointer rounded-[8px] border p-4 transition-all ${
                questionCount === 20
                  ? 'border-[#10262C] bg-[#E9ECE5]/60 shadow-sm'
                  : 'border-[#10262C]/10 bg-[#F8F9F6] hover:border-[#10262C]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#10262C]">標準模擬測驗</span>
                <span className="rounded-[2px] bg-[#10262C] px-1.5 py-0.5 text-[10px] font-semibold text-[#F8F9F6]">
                  20 題 (推薦)
                </span>
              </div>
              <p className="mt-2 text-xs text-[#5C6D70]">
                全方位覆蓋字義、聽力、詞根拆解與克漏字填空，全面評估程度。
              </p>
            </div>

            <div
              onClick={() => setQuestionCount(50)}
              className={`cursor-pointer rounded-[8px] border p-4 transition-all ${
                questionCount === 50
                  ? 'border-[#10262C] bg-[#E9ECE5]/60 shadow-sm'
                  : 'border-[#10262C]/10 bg-[#F8F9F6] hover:border-[#10262C]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#10262C]">深度刷題馬拉松</span>
                <span className="rounded-[2px] bg-[#10262C]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#10262C]">
                  50 題
                </span>
              </div>
              <p className="mt-2 text-xs text-[#5C6D70]">
                高強度刷題訓練，全面暴露記憶盲點，極速擴充實戰答題直覺。
              </p>
            </div>
          </div>

          {/* 題型分類篩選 */}
          <div className="rounded-[8px] border border-[#10262C]/10 bg-[#F8F9F6] p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#10262C]">
              測驗專項分類
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: 'all', label: '綜合混合模式', desc: '英中/詞根/聽力/克漏字全隨機' },
                { id: 'vocab', label: '英中核心字義', desc: '雙向選擇題專項突破' },
                { id: 'roots', label: '詞根磁貼拼裝', desc: '前綴字根後綴精準拼裝' },
                { id: 'listening', label: '影視聽力與語境', desc: '真聲辨詞與例句克漏字' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedQuizCategory(cat.id as any)}
                  className={`flex flex-col items-start rounded-[6px] border p-3 text-left transition-all ${
                    selectedQuizCategory === cat.id
                      ? 'border-[#10262C] bg-[#10262C] text-[#F8F9F6]'
                      : 'border-[#10262C]/10 bg-white text-[#10262C] hover:bg-[#E9ECE5]/40'
                  }`}
                >
                  <span className="text-xs font-bold">{cat.label}</span>
                  <span
                    className={`mt-1 text-[10px] ${
                      selectedQuizCategory === cat.id ? 'text-[#F8F9F6]/80' : 'text-[#5C6D70]'
                    }`}
                  >
                    {cat.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 主題偏好篩選 */}
          <div className="rounded-[8px] border border-[#10262C]/10 bg-[#F8F9F6] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#10262C]">
                單字語境主題
              </h3>
              <span className="text-[11px] text-[#5C6D70]">
                當前池內：
                {
                  allWords.filter((w) => selectedTopic === 'all' || w.topic === selectedTopic)
                    .length
                }{' '}
                字
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: '全庫大混抽 (All Topics)' },
                { id: 'daily', label: '生活日常 (Daily Life)' },
                { id: 'animation', label: '動畫神作 (Animation)' },
                { id: 'sci-fi', label: '星際科幻 (Sci-Fi)' },
                { id: 'cinema', label: '影視名場面 (Cinema)' },
                { id: 'sitcom', label: '生活喜劇 (Sitcom)' },
                { id: 'business', label: '商業演講 (Business)' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id as LearningTopic)}
                  className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedTopic === t.id
                      ? 'bg-[#10262C] text-[#F8F9F6]'
                      : 'border border-[#10262C]/15 bg-white text-[#10262C] hover:bg-[#E9ECE5]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 開始按鈕 */}
          <button
            onClick={handleStartQuiz}
            className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#10262C] py-3.5 text-sm font-bold text-[#F8F9F6] shadow-sm hover:bg-[#1A3840] transition-colors"
          >
            <Brain className="h-4 w-4" />
            啟動演算法出題 ({questionCount} 題)
          </button>
        </div>
      )}

      {/* 階段 2：測驗進行中面板 */}
      {stage === 'playing' && questions.length > 0 && (
        <div>
          {/* 進度條與計分器 */}
          <div className="mb-4 flex items-center justify-between text-xs text-[#5C6D70]">
            <span>
              第 <strong className="text-[#10262C] font-bold">{currentIndex + 1}</strong> 題 / 共{' '}
              {questions.length} 題
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#10262C]/10 px-2 py-0.5 text-[11px] font-semibold text-[#10262C]">
                答對率: {currentIndex > 0 ? Math.round((score / currentIndex) * 100) : 100}%
              </span>
              <span>得分: {score}</span>
            </div>
          </div>

          <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#10262C]/10">
            <div
              className="h-full bg-[#10262C] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* 題目主容器 */}
          {(() => {
            const currentQ = questions[currentIndex]
            return (
              <div className="rounded-[10px] border border-[#10262C]/10 bg-[#F8F9F6] p-6 shadow-xs">
                {/* 題型標籤 */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[2px] bg-[#10262C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F8F9F6]">
                      {currentQ.type === 'en_to_zh' && '英選中選擇題'}
                      {currentQ.type === 'zh_to_en' && '中選英選擇題'}
                      {currentQ.type === 'morpheme_assembly' && '詞根磁貼拼裝'}
                      {currentQ.type === 'audio_listening' && '聽音辨詞題'}
                      {currentQ.type === 'sentence_cloze' && '例句克漏字填空'}
                    </span>
                    <span className="text-[11px] text-[#5C6D70]">
                      難度標籤: {currentQ.targetWord.levelTag}
                    </span>
                  </div>

                  {/* 語音朗讀按鈕 */}
                  <button
                    onClick={() => ttsService.speak(currentQ.targetWord.word)}
                    className="flex items-center gap-1 rounded-[4px] border border-[#10262C]/15 bg-white px-2 py-1 text-xs text-[#10262C] hover:bg-[#E9ECE5] transition-colors"
                    title="播放單字原音朗讀"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    發音
                  </button>
                </div>

                {/* 題目題目區 */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-[#10262C]">
                    {currentQ.prompt}
                  </h2>
                  {currentQ.subPrompt && (
                    <p className="mt-1.5 text-xs text-[#5C6D70]">{currentQ.subPrompt}</p>
                  )}
                </div>

                {/* 選擇題選項 (四選一) */}
                {currentQ.options && currentQ.options.length > 0 && (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {currentQ.options.map((opt, optIdx) => {
                      let btnStyle =
                        'border-[#10262C]/15 bg-white text-[#10262C] hover:border-[#10262C]/40 hover:bg-[#E9ECE5]/30'

                      if (isAnswered) {
                        const isThisCorrect =
                          opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()
                        const isThisSelected = selectedAnswer === opt

                        if (isThisCorrect) {
                          btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through'
                        } else {
                          btnStyle = 'border-[#10262C]/10 bg-white/50 text-[#5C6D70] opacity-60'
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(opt)}
                          className={`flex items-center justify-between rounded-[6px] border p-3.5 text-left text-sm transition-all ${btnStyle}`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[3px] border border-current/20 bg-black/5 text-[11px] font-mono font-bold shrink-0">
                              {['A', 'B', 'C', 'D'][optIdx] || optIdx + 1}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered &&
                            opt.trim().toLowerCase() ===
                              currentQ.correctAnswer.trim().toLowerCase() && (
                              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            )}
                          {isAnswered &&
                            selectedAnswer === opt &&
                            opt.trim().toLowerCase() !==
                              currentQ.correctAnswer.trim().toLowerCase() && (
                              <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* 詞根磁貼拼裝區域 */}
                {currentQ.type === 'morpheme_assembly' && currentQ.assemblyTiles && (
                  <div className="space-y-4">
                    {/* 已拼裝槽位 */}
                    <div className="min-h-[52px] rounded-[6px] border border-dashed border-[#10262C]/30 bg-white p-2.5 flex flex-wrap items-center gap-2">
                      {assembledTiles.length === 0 ? (
                        <span className="text-xs text-[#5C6D70] italic">
                          點擊下方磁貼按鈕，將單字依序拼出...
                        </span>
                      ) : (
                        assembledTiles.map((t, tIdx) => (
                          <span
                            key={t.id}
                            onClick={() => handleRemoveTile(tIdx)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] bg-[#10262C] px-2.5 py-1 text-xs font-bold text-[#F8F9F6] shadow-xs hover:bg-rose-700 transition-colors"
                            title="點擊可移除"
                          >
                            {t.text}
                            <span className="text-[10px] text-[#F8F9F6]/70">x</span>
                          </span>
                        ))
                      )}
                    </div>

                    {/* 可選磁貼候選池 */}
                    <div className="flex flex-wrap gap-2">
                      {currentQ.assemblyTiles.map((tile) => {
                        const isUsed = assembledTiles.some((at) => at.id === tile.id)
                        return (
                          <button
                            key={tile.id}
                            disabled={isUsed || isAnswered}
                            onClick={() => handleTileClick(tile)}
                            className={`rounded-[4px] border px-3 py-1.5 text-xs font-semibold transition-all ${
                              isUsed
                                ? 'border-[#10262C]/10 bg-[#E9ECE5]/30 text-[#5C6D70]/40 cursor-not-allowed'
                                : 'border-[#10262C]/20 bg-white text-[#10262C] hover:border-[#10262C] hover:bg-[#E9ECE5]'
                            }`}
                          >
                            {tile.text}
                          </button>
                        )
                      })}
                    </div>

                    {!isAnswered && (
                      <button
                        onClick={handleSubmitAssembly}
                        disabled={assembledTiles.length === 0}
                        className="rounded-[4px] bg-[#10262C] px-4 py-2 text-xs font-bold text-[#F8F9F6] hover:bg-[#1A3840] disabled:opacity-50 transition-colors"
                      >
                        確認送出拼裝
                      </button>
                    )}
                  </div>
                )}

                {/* 作答後解析回饋 */}
                {isAnswered && (
                  <div
                    className={`mt-6 rounded-[6px] border p-4 ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                        : 'border-rose-200 bg-rose-50/70 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>回答正確！</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-rose-600" />
                          <span>答錯了，正解為：{currentQ.correctAnswer}</span>
                        </>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-relaxed opacity-90">{currentQ.explanation}</p>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-1.5 rounded-[4px] bg-[#10262C] px-4 py-2 text-xs font-bold text-[#F8F9F6] hover:bg-[#1A3840] transition-colors cursor-pointer"
                      >
                        <span>{currentIndex + 1 < questions.length ? '下一題' : '查看總結報告'}</span>
                        <kbd className="px-1.5 py-0.2 rounded-[3px] bg-white/20 text-[10px] font-mono text-[#F8F9F6]">
                          Space
                        </kbd>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* 階段 3：測驗總結與錯題回流面板 */}
      {stage === 'summary' && (
        <div className="space-y-6">
          {/* 成績單大卡 */}
          <div className="rounded-[10px] border border-[#10262C]/10 bg-[#F8F9F6] p-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#10262C] text-[#F8F9F6]">
              <Award className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold text-[#10262C]">測驗圓滿完成！</h2>
            <p className="mt-1 text-xs text-[#5C6D70]">
              總題數：{questions.length} 題 · 答對：{score} 題 · 答錯：{mistakes.length} 題
            </p>

            <div className="my-5 inline-flex items-center gap-4 rounded-[6px] border border-[#10262C]/15 bg-white px-6 py-3">
              <div>
                <span className="block text-[10px] font-semibold uppercase text-[#5C6D70]">
                  綜合答對率
                </span>
                <span className="text-2xl font-black text-[#10262C]">
                  {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-8 w-px bg-[#10262C]/10" />
              <div>
                <span className="block text-[10px] font-semibold uppercase text-[#5C6D70]">
                  學習表現評價
                </span>
                <span className="text-sm font-bold text-[#10262C]">
                  {score / questions.length >= 0.8
                    ? '卓越極佳 (Excellent)'
                    : score / questions.length >= 0.6
                      ? '穩健扎實 (Good)'
                      : '仍需加強 (Need Review)'}
                </span>
              </div>
            </div>

            {/* 錯題一鍵回流按鈕 */}
            {mistakes.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={handleSyncMistakesToFSRS}
                  disabled={fsrsSyncing || fsrsSyncedCount !== null}
                  className="inline-flex items-center gap-2 rounded-[6px] bg-[#10262C] px-5 py-2.5 text-xs font-bold text-[#F8F9F6] shadow-sm hover:bg-[#1A3840] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  {fsrsSyncing
                    ? '同步寫入記憶曲線中...'
                    : fsrsSyncedCount !== null
                      ? `已成功將 ${fsrsSyncedCount} 個錯題排入 FSRS 複習！`
                      : `一鍵將 ${mistakes.length} 道錯題排入 FSRS 複習系統`}
                </button>
                {fsrsSyncedCount !== null && (
                  <p className="mt-2 text-[11px] text-emerald-700">
                    這些錯題將自動以最高優先級排入明天的「背單字」閃卡隊列！
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setStage('config')}
                className="flex items-center gap-1.5 rounded-[4px] border border-[#10262C]/20 bg-white px-4 py-2 text-xs font-semibold text-[#10262C] hover:bg-[#E9ECE5] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                重新再來一輪
              </button>

              {onNavigateToStudy && (
                <button
                  onClick={onNavigateToStudy}
                  className="rounded-[4px] bg-[#10262C] px-4 py-2 text-xs font-semibold text-[#F8F9F6] hover:bg-[#1A3840] transition-colors"
                >
                  前往閃卡複習專區
                </button>
              )}
            </div>
          </div>

          {/* 錯題檢視明細清單 */}
          {mistakes.length > 0 && (
            <div className="rounded-[10px] border border-[#10262C]/10 bg-[#F8F9F6] p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#10262C] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                錯題本分析明細 ({mistakes.length} 題)
              </h3>

              <div className="space-y-3">
                {mistakes.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-[6px] border border-[#10262C]/10 bg-white p-3.5 text-xs text-[#10262C]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#10262C]">
                        {m.question.targetWord.word}
                      </span>
                      <span className="text-[11px] text-[#5C6D70]">
                        {m.question.targetWord.pos.join(', ')} ·{' '}
                        {m.question.targetWord.meaningsZh[0]}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-[11px]">
                      <div>
                        題目提示：<span className="text-[#10262C]">{m.question.prompt}</span>
                      </div>
                      <div>
                        你的作答：<span className="text-rose-600 font-medium">{m.userAnswer}</span>
                      </div>
                      <div>
                        正解答案：
                        <span className="text-emerald-700 font-bold">
                          {m.question.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {m.question.targetWord.mnemonic && (
                      <div className="mt-2 rounded-[2px] bg-[#10262C]/5 p-2 text-[11px] text-[#5C6D70]">
                        詞根助記：{m.question.targetWord.mnemonic}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
