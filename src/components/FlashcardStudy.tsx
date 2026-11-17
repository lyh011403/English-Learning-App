import { useState, useEffect } from 'react'
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Eye,
  Sparkles,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Star,
} from 'lucide-react'
import type { RootMorpheme, LearningTopic } from '../types/lexiclip'
import { morphemeService, type DetailedWord } from '../services/morphemeService'
import { fsrsScheduler } from '../services/fsrsScheduler'
import { ttsService } from '../services/ttsService'
import { ClipPlayer } from './ClipPlayer'

export interface FlashcardStudyProps {
  initialWordId?: string
  onSelectWord?: (wordId: string) => void
}

const TOPIC_LABELS: { id: LearningTopic; label: string }[] = [
  { id: 'all', label: '綜合全覽' },
  { id: 'daily', label: '生活日常' },
  { id: 'animation', label: '皮克斯/動畫' },
  { id: 'sci-fi', label: '科幻/未來' },
  { id: 'cinema', label: '影視名場面' },
  { id: 'sitcom', label: '生活喜劇' },
  { id: 'business', label: '演講/商業' },
]

export function FlashcardStudy({ initialWordId, onSelectWord: _onSelectWord }: FlashcardStudyProps) {
  const [currentWord, setCurrentWord] = useState<DetailedWord | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic>('all')
  const [showAnswer, setShowAnswer] = useState(false)
  const [activeMorphemeInfo, setActiveMorphemeInfo] = useState<RootMorpheme | null>(null)
  const [undoAvailable, setUndoAvailable] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
  const [onlyStarredFilter, setOnlyStarredFilter] = useState(false)

  useEffect(() => {
    // 讀取偏好設定中的主題
    const settings = fsrsScheduler.getDailySettings()
    if (settings.preferredTopic) {
      setSelectedTopic(settings.preferredTopic)
    }
  }, [])

  useEffect(() => {
    loadNextCard(initialWordId, selectedTopic, onlyStarredFilter)
  }, [initialWordId, selectedTopic, onlyStarredFilter])

  const loadNextCard = async (
    targetWordId?: string,
    topic: LearningTopic = selectedTopic,
    starredOnly = onlyStarredFilter
  ) => {
    setLoading(true)
    setShowAnswer(false)
    setActiveMorphemeInfo(null)

    if (targetWordId) {
      const detailed = await morphemeService.getWordWithMorphemes(targetWordId)
      if (detailed) {
        setCurrentWord(detailed)
        const starred = await fsrsScheduler.isWordStarred(detailed.id)
        setIsStarred(starred)
        setLoading(false)
        setIsCompleted(false)
        return
      }
    }

    // 依當前主題取得待學習/待複習單字 (支援星號生詞專項篩選)
    const dueCards = await fsrsScheduler.getDueCards(1, topic, starredOnly)
    if (dueCards.length > 0) {
      const detailed = await morphemeService.getWordWithMorphemes(dueCards[0].word.id)
      setCurrentWord(detailed)
      if (detailed) {
        const starred = await fsrsScheduler.isWordStarred(detailed.id)
        setIsStarred(starred)
      }
      setIsCompleted(false)
    } else {
      setCurrentWord(null)
      setIsCompleted(true)
    }
    setLoading(false)
  }

  // 切換當前單字星號收藏狀態
  const handleToggleStar = async () => {
    if (!currentWord) return
    const newState = await fsrsScheduler.toggleWordStar(currentWord.id)
    setIsStarred(newState)
  }

  // 播放單字發音 (TTS)
  const handlePronounce = () => {
    if (currentWord) {
      ttsService.speak(currentWord.word)
    }
  }

  // 評分送出 (1=Again, 2=Hard, 3=Good, 4=Easy)
  const handleRate = async (rating: 1 | 2 | 3 | 4) => {
    if (!currentWord) return

    await fsrsScheduler.reviewCard(currentWord.id, rating)
    setUndoAvailable(true)

    setTimeout(() => {
      setUndoAvailable(false)
    }, 8000)

    loadNextCard(undefined, selectedTopic)
  }

  // 全域鍵盤快捷鍵 (Space=翻牌, 1-4=評分, R=發音, Z=復原)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 若焦點在輸入框，不攔截
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      // Space 或 Enter：翻開/隱藏答案
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        setShowAnswer((prev) => !prev)
        return
      }

      // R 或 P：朗讀發音
      if (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'p') {
        e.preventDefault()
        handlePronounce()
        return
      }

      // S：切換單字星號收藏
      if (e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleToggleStar()
        return
      }

      // Z：復原上一筆評分
      if (e.key.toLowerCase() === 'z' && undoAvailable) {
        e.preventDefault()
        handleUndo()
        return
      }

      // 1, 2, 3, 4：評分 (在顯示答案時有效)
      if (showAnswer && currentWord) {
        if (e.key === '1') {
          e.preventDefault()
          handleRate(1)
        } else if (e.key === '2') {
          e.preventDefault()
          handleRate(2)
        } else if (e.key === '3') {
          e.preventDefault()
          handleRate(3)
        } else if (e.key === '4') {
          e.preventDefault()
          handleRate(4)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAnswer, currentWord, undoAvailable])

  // 執行復原 (Undo)
  const handleUndo = async () => {
    const success = await fsrsScheduler.undoLastReview()
    if (success && currentWord) {
      setUndoAvailable(false)
      loadNextCard(currentWord.id, selectedTopic)
    }
  }

  const handleTopicChange = (newTopic: LearningTopic) => {
    setSelectedTopic(newTopic)
    const settings = fsrsScheduler.getDailySettings()
    fsrsScheduler.saveDailySettings({ ...settings, preferredTopic: newTopic })
  }

  return (
    <div className="space-y-4">
      {/* 頂部主題方向篩選膠囊列 */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[11px] font-medium text-[#5C6770]">主題方向：</span>
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-[6px] border border-[rgba(20,26,30,0.1)]">
            {TOPIC_LABELS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTopicChange(t.id)}
                className={`px-2.5 py-1 text-xs rounded-[4px] font-medium transition-colors cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-[#1A535C] text-white shadow-2xs'
                    : 'text-[#5C6770] hover:text-[#141A1E]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 生詞星號收藏專項篩選按鈕 */}
          <button
            onClick={() => setOnlyStarredFilter((prev) => !prev)}
            title="僅複習已加星號標記的生詞本"
            className={`px-2.5 py-1 text-xs rounded-[5px] font-medium transition-colors cursor-pointer flex items-center space-x-1 shrink-0 ${
              onlyStarredFilter
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-[#5C6770] border border-[rgba(20,26,30,0.1)] hover:text-[#141A1E]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyStarredFilter ? 'fill-white text-white' : 'text-amber-500'}`} />
            <span>生詞本</span>
          </button>
        </div>

        {/* 詞根速成教學開關 */}
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="inline-flex items-center space-x-1 text-xs text-[#1A535C] hover:underline font-medium shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showTutorial ? '收起教學' : '詞根記憶心法'}</span>
        </button>
      </div>

      {/* 詞根拆解教學指南卡片 */}
      {showTutorial && (
        <div className="bg-[#FAF1EB] rounded-[8px] border border-[rgba(212,123,56,0.25)] p-4 text-xs text-[#141A1E] space-y-2 animate-fade-in shadow-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#D47B38]">
            <Lightbulb className="w-4 h-4" />
            <span>英文詞根字源記憶 3 大金律：</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[#5C6770]">
            <div className="bg-white p-2.5 rounded-[5px] border border-[rgba(212,123,56,0.15)]">
              <span className="font-bold text-[#141A1E]">1. 前綴 (Prefix) 定「方向與態勢」：</span>
              <p className="mt-1">
                如 `syn-`(同時/聚合)、`de-`(向下/拆解)、`pro-`(向前推動)。決定單字的運動方向。
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-[5px] border border-[rgba(212,123,56,0.15)]">
              <span className="font-bold text-[#141A1E]">2. 字根 (Root) 定「核心本義」：</span>
              <p className="mt-1">
                如 `chron`(時間)、`struct`(建造)、`spect`(看)。是家族所有單字的母體基因。
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-[5px] border border-[rgba(212,123,56,0.15)]">
              <span className="font-bold text-[#141A1E]">3. 後綴 (Suffix) 定「詞性定位」：</span>
              <p className="mt-1">
                如 `-ize`(使動詞)、`-tion`(名詞)、`-able`(形容詞)。決定單字在句子中的角色。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8 秒 Undo 懸浮提醒膠囊 */}
      {undoAvailable && (
        <div className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#0D161A] text-white text-xs shadow-md border border-[#223038] animate-fade-in">
          <span>已記錄複習狀態至 FSRS 曲線</span>
          <button
            onClick={handleUndo}
            className="inline-flex items-center space-x-1 text-[#D47B38] hover:text-[#E89354] font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>復原上一步 (Undo)</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-8 text-center text-sm text-[#5C6770] shadow-xs">
          單字資料與語境片段載入中...
        </div>
      ) : isCompleted || !currentWord ? (
        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#ECEAE2] mx-auto flex items-center justify-center text-[#1A535C]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#141A1E]">
            {selectedTopic === 'all'
              ? '今日排程單字已全數完成'
              : `【${TOPIC_LABELS.find((t) => t.id === selectedTopic)?.label}】主題今日卡片已讀畢`}
          </h2>
          <p className="text-xs text-[#5C6770] max-w-sm mx-auto leading-relaxed">
            太棒了！無待複習項目。您可以切換至其他主題方向繼續挑戰，或在「詞根樹」中探索同源詞。
          </p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handleTopicChange('all')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-[5px] bg-[#1A535C] text-white text-xs font-medium hover:bg-[#14424A] transition-colors cursor-pointer"
            >
              <span>查看全部主題單字</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* 單字主卡片 (Light Paper 實體紙面) */
        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-5 md:p-6 shadow-xs space-y-5">
          {/* 卡片頭部：單字、音標、發音與主題等級標籤 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(20,26,30,0.08)] pb-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#141A1E]">
                {currentWord.word}
              </h1>
              <button
                onClick={handlePronounce}
                title="英式/美式發音 (TTS)"
                className="p-1.5 rounded-[5px] bg-[#ECEAE2] text-[#1A535C] hover:bg-[#E0DDD3] transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {currentWord.ipa && (
                <span className="font-mono text-sm text-[#8E99A2]">{currentWord.ipa}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* 星號收藏切換按鈕 */}
              <button
                onClick={handleToggleStar}
                title="標記為重點生詞 (快捷鍵 S)"
                className={`p-1.5 rounded-[5px] border transition-colors cursor-pointer flex items-center space-x-1 ${
                  isStarred
                    ? 'bg-amber-50 border-amber-300 text-amber-500'
                    : 'bg-[#F6F5F0] border-[rgba(20,26,30,0.1)] text-[#8E99A2] hover:text-amber-500'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span className="text-[10px] font-mono font-semibold">S</span>
              </button>

              <span className="text-[11px] px-2 py-0.5 rounded-[2px] font-mono bg-[#ECEAE2] text-[#1A535C] border border-[rgba(26,83,92,0.15)]">
                {currentWord.levelTag}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-[2px] font-mono bg-[#FAF1EB] text-[#D47B38] border border-[rgba(212,123,56,0.15)]">
                {TOPIC_LABELS.find((t) => t.id === currentWord.topic)?.label || currentWord.topic}
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-[2px] font-mono bg-[#F6F5F0] text-[#5C6770]">
                {currentWord.pos.join(', ')}
              </span>
            </div>
          </div>

          {/* 語源助記拆解公式 (Mnemonic Formula) */}
          {currentWord.mnemonic && (
            <div className="p-3 rounded-[6px] bg-[#F4F8F8] border border-[rgba(26,83,92,0.15)] flex items-start space-x-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#1A535C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1A535C]">語源拆解助記法：</span>
                <p className="text-[#141A1E] font-medium mt-0.5">{currentWord.mnemonic}</p>
              </div>
            </div>
          )}

          {/* 詞根拆解區 (Morpheme Breakdown) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs font-semibold text-[#141A1E]">
                <span>詞根結構標籤（點擊檢視來源出處）</span>
              </div>
              <span className="text-[11px] text-[#8E99A2]">
                共 {currentWord.morphemes.length} 個詞綴節點
              </span>
            </div>

            {/* 詞根微膠囊標籤列 */}
            <div className="flex flex-wrap gap-2">
              {currentWord.morphemes.map((m) => {
                const isActive = activeMorphemeInfo?.id === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveMorphemeInfo(isActive ? null : m)}
                    className={`px-2.5 py-1 rounded-[4px] text-xs font-mono transition-all cursor-pointer border ${
                      m.type === 'prefix'
                        ? isActive
                          ? 'bg-[#1A535C] text-white border-[#1A535C]'
                          : 'bg-[#EBF1F2] text-[#1A535C] border-[rgba(26,83,92,0.25)] hover:border-[#1A535C]'
                        : m.type === 'root'
                        ? isActive
                          ? 'bg-[#D47B38] text-white border-[#D47B38]'
                          : 'bg-[#FAF1EB] text-[#D47B38] border-[rgba(212,123,56,0.25)] hover:border-[#D47B38]'
                        : isActive
                        ? 'bg-[#4A5568] text-white border-[#4A5568]'
                        : 'bg-[#EDF2F7] text-[#4A5568] border-[rgba(74,85,104,0.25)] hover:border-[#4A5568]'
                    }`}
                  >
                    <span className="font-bold">{m.morpheme}</span>
                    <span className="ml-1 text-[10px] opacity-80">
                      ({m.type === 'prefix' ? '前綴' : m.type === 'root' ? '字根' : '後綴'})
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 詞根即時字源詳情卡 */}
            {activeMorphemeInfo && (
              <div className="p-3 rounded-[6px] bg-[#F6F5F0] border border-[rgba(20,26,30,0.1)] text-xs text-[#141A1E] space-y-1 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1A535C]">
                    {activeMorphemeInfo.morpheme} · {activeMorphemeInfo.meaningZh} (
                    {activeMorphemeInfo.meaning})
                  </span>
                  <span className="text-[#8E99A2] font-mono">{activeMorphemeInfo.origin}</span>
                </div>
                <p className="text-[#5C6770]">
                  點擊底部導航「詞根樹」可反查所有同源單字家族。
                </p>
              </div>
            )}
          </div>

          {/* 影劇與動畫真實語境片段嵌入 (YouTube IFrame + 降級 TTS + 中英雙字幕) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#141A1E]">
              <span>影視動畫真實語境片段 (原聲台詞 + 中英對照)</span>
              {currentWord.clips.length > 0 && currentWord.clips[0].sourceName && (
                <span className="text-[11px] text-[#1A535C] font-mono">
                  {currentWord.clips[0].sourceName}
                </span>
              )}
            </div>
            <ClipPlayer clips={currentWord.clips} targetWord={currentWord.word} />
          </div>

          {/* 釋義展開與例句區 */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 rounded-[6px] bg-[#ECEAE2] hover:bg-[#E0DDD3] text-[#141A1E] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#5C6770]" />
              <span>查看繁體中文釋義、定義與例句</span>
              <kbd className="ml-1.5 px-1.5 py-0.5 rounded-[3px] bg-white border border-[rgba(20,26,30,0.15)] text-[10px] text-[#5C6770] font-mono">
                Space
              </kbd>
            </button>
          ) : (
            <div className="p-4 rounded-[6px] bg-[#FDFDFB] border border-[rgba(20,26,30,0.1)] space-y-3 animate-fade-in">
              <div>
                <span className="text-xs font-semibold text-[#1A535C]">中文繁體釋義：</span>
                <p className="text-sm font-medium text-[#141A1E] mt-0.5">
                  {currentWord.meaningsZh.join('； ')}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#5C6770]">英文定義：</span>
                <p className="text-xs text-[#5C6770] mt-0.5 leading-relaxed">
                  {currentWord.meanings.join(' ')}
                </p>
              </div>

              {/* 中英雙語例句 */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <div className="pt-2 border-t border-[rgba(20,26,30,0.06)] space-y-2">
                  <div className="flex items-center space-x-1 text-xs font-semibold text-[#141A1E]">
                    <BookOpen className="w-3.5 h-3.5 text-[#1A535C]" />
                    <span>實用情境例句：</span>
                  </div>
                  {currentWord.examples.map((ex, idx) => (
                    <div key={idx} className="bg-[#F8F9F6] p-2.5 rounded-[5px] text-xs space-y-0.5">
                      <p className="text-[#141A1E] font-medium">“{ex.en}”</p>
                      <p className="text-[#5C6770]">{ex.zh}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FSRS 4 級評分控制區 */}
          <div className="pt-2 border-t border-[rgba(20,26,30,0.08)]">
            <div className="text-[11px] text-[#8E99A2] mb-2 flex items-center justify-between">
              <span>FSRS 記憶曲線評分：</span>
              <span>評分後自動進入下一個單字</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleRate(1)}
                className="py-2 px-1 rounded-[5px] bg-[#FAF0ED] text-[#C0392B] border border-[rgba(192,57,43,0.2)] hover:bg-[#F5DFD9] text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-white/70 rounded-[3px] border border-[rgba(192,57,43,0.3)]">1</span>
                  <span>重來 (Again)</span>
                </div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">&lt; 10 分鐘</div>
              </button>
              <button
                onClick={() => handleRate(2)}
                className="py-2 px-1 rounded-[5px] bg-[#FDF8EC] text-[#D47B38] border border-[rgba(212,123,56,0.2)] hover:bg-[#F9EDD0] text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-white/70 rounded-[3px] border border-[rgba(212,123,56,0.3)]">2</span>
                  <span>困難 (Hard)</span>
                </div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">1-2 天</div>
              </button>
              <button
                onClick={() => handleRate(3)}
                className="py-2 px-1 rounded-[5px] bg-[#EBF5FB] text-[#2980B9] border border-[rgba(41,128,185,0.2)] hover:bg-[#D4E6F1] text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-white/70 rounded-[3px] border border-[rgba(41,128,185,0.3)]">3</span>
                  <span>良好 (Good)</span>
                </div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">3-4 天</div>
              </button>
              <button
                onClick={() => handleRate(4)}
                className="py-2 px-1 rounded-[5px] bg-[#EAFAF1] text-[#27AE60] border border-[rgba(39,174,96,0.2)] hover:bg-[#D5F5E3] text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-white/70 rounded-[3px] border border-[rgba(39,174,96,0.3)]">4</span>
                  <span>簡單 (Easy)</span>
                </div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">&gt; 7 天</div>
              </button>
            </div>
          </div>

          {/* 生詞星號收藏專項篩選按鈕 */}
          <button
            onClick={() => setOnlyStarredFilter((prev) => !prev)}
            title="僅複習已加星號標記的生詞本"
            className={`px-2.5 py-1 text-xs rounded-[5px] font-medium transition-colors cursor-pointer flex items-center space-x-1 shrink-0 ${
              onlyStarredFilter
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-[#5C6770] border border-[rgba(20,26,30,0.1)] hover:text-[#141A1E]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyStarredFilter ? 'fill-white text-white' : 'text-amber-500'}`} />
            <span>生詞本</span>
          </button>
        </div>
      )}
    </div>
  )
}
