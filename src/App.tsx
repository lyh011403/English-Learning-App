import { useState, useEffect, lazy, Suspense } from 'react'
import { BookOpen, Film, GitFork, Award, Settings, Search, X, Globe, Plus, Sparkles, Brain } from 'lucide-react'
import { morphemeService } from './services/morphemeService'
import { dictionaryService, type OnlineWordResult } from './services/dictionaryService'
import type { WordEntry, RootMorpheme } from './types/lexiclip'

// 路由組件 Code Splitting (按需延遲載入，優化首屏 Bundle 體積)
const FlashcardStudy = lazy(() =>
  import('./components/FlashcardStudy').then((m) => ({ default: m.FlashcardStudy }))
)
const RootsExplorer = lazy(() =>
  import('./components/RootsExplorer').then((m) => ({ default: m.RootsExplorer }))
)
const ClipsExplorer = lazy(() =>
  import('./components/ClipsExplorer').then((m) => ({ default: m.ClipsExplorer }))
)
const StatsView = lazy(() =>
  import('./components/StatsView').then((m) => ({ default: m.StatsView }))
)
const SettingsView = lazy(() =>
  import('./components/SettingsView').then((m) => ({ default: m.SettingsView }))
)
const QuizCenter = lazy(() =>
  import('./components/QuizCenter').then((m) => ({ default: m.QuizCenter }))
)

function TabLoadingFallback() {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-2.5 text-[#5C6770]">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1A535C] border-t-transparent" />
      <span className="text-xs font-medium text-[#8E99A2]">模組載入中...</span>
    </div>
  )
}

export type NavTab = 'flashcard' | 'roots' | 'clips' | 'quiz' | 'stats' | 'settings'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('flashcard')
  const [selectedWordId, setSelectedWordId] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ words: WordEntry[]; roots: RootMorpheme[] }>({
    words: [],
    roots: [],
  })
  const [isSearching, setIsSearching] = useState(false)
  const [isDbReady, setIsDbReady] = useState(false)

  // 線上辭典查詢狀態
  const [onlineResult, setOnlineResult] = useState<OnlineWordResult | null>(null)
  const [isOnlineSearching, setIsOnlineSearching] = useState(false)

  // 初始化種子詞庫
  useEffect(() => {
    morphemeService.seedDatabaseIfEmpty().then(() => {
      setIsDbReady(true)
    })
  }, [])

  // 即時搜尋監聽
  useEffect(() => {
    setOnlineResult(null)
    if (!searchQuery.trim()) {
      setSearchResults({ words: [], roots: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      const res = await morphemeService.searchWordsAndRoots(searchQuery)
      setSearchResults(res)
      setIsSearching(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectWord = (wordId: string) => {
    setSelectedWordId(wordId)
    setActiveTab('flashcard')
    setSearchQuery('')
    setOnlineResult(null)
  }

  // 發起線上辭典即時檢索
  const handleOnlineLookup = async () => {
    if (!searchQuery.trim()) return
    setIsOnlineSearching(true)
    const res = await dictionaryService.lookupOnline(searchQuery)
    setOnlineResult(res)
    setIsOnlineSearching(false)
  }

  // 將線上查出的單字收錄至個人生字本
  const handleAddOnlineWordToDeck = async () => {
    if (onlineResult?.entry) {
      await morphemeService.addCustomWord(onlineResult.entry)
      handleSelectWord(onlineResult.entry.id)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F0] text-[#141A1E]">
      {/* 頂部沉浸導航列 (深墨 + 乾淨層次) */}
      <header className="sticky top-0 z-30 bg-[#0D161A] text-[#EDF2F4] border-b border-[#223038] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-[5px] bg-[#1A535C] flex items-center justify-center font-bold text-xs tracking-wider text-white">
            LX
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight tracking-wide text-white">LexiClip</h1>
            <p className="text-[10px] text-[#8E99A2]">背單字 · 詞根圖譜 · 影劇原聲語境</p>
          </div>
        </div>

        {/* 離線優先狀態徽章 */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono rounded-[2px] bg-[#142026] text-[#A5B4BF] border border-[#2A3B45]">
            離線優先 (Local Ready)
          </span>
        </div>
      </header>

      {/* 主學習區域 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3.5 md:p-6 flex flex-col space-y-4">
        {/* 全域即時搜尋列 */}
        <div className="relative">
          <div className="flex items-center space-x-2 bg-white rounded-[6px] border border-[rgba(20,26,30,0.12)] px-3 py-2 shadow-xs focus-within:border-[#1A535C] transition-colors">
            <Search className="w-4 h-4 text-[#8E99A2] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋單字（如 synchronize）、詞根（chrono-, struct）或線上查詞..."
              className="w-full bg-transparent text-xs md:text-sm text-[#141A1E] focus:outline-none placeholder-[#8E99A2]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setOnlineResult(null)
                }}
                className="text-[#8E99A2] hover:text-[#141A1E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 搜尋下拉結果彈窗 */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[8px] border border-[rgba(20,26,30,0.12)] shadow-lg z-40 max-h-96 overflow-y-auto p-3 space-y-3">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-[#8E99A2]">本地搜尋中...</div>
              ) : (
                <>
                  {/* 本地單字結果 */}
                  {searchResults.words.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-[#8E99A2] px-1">本機單字庫</div>
                      {searchResults.words.map((w) => (
                        <div
                          key={w.id}
                          onClick={() => handleSelectWord(w.id)}
                          className="p-2 rounded-[5px] hover:bg-[#ECEAE2] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-xs text-[#141A1E]">{w.word}</span>
                            <span className="text-xs text-[#5C6770] ml-2">
                              {w.meaningsZh.join('； ')}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8E99A2]">{w.levelTag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 本地詞根結果 */}
                  {searchResults.roots.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[rgba(20,26,30,0.06)]">
                      <div className="text-[10px] font-semibold text-[#8E99A2] px-1">本機詞根庫</div>
                      {searchResults.roots.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setActiveTab('roots')
                            setSearchQuery('')
                          }}
                          className="p-2 rounded-[5px] hover:bg-[#ECEAE2] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-mono font-bold text-xs text-[#1A535C]">
                              {r.morpheme}
                            </span>
                            <span className="text-xs text-[#5C6770] ml-2">
                              {r.meaningZh} ({r.meaning})
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8E99A2]">{r.type}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 線上辭典查詢發起區 (針對任意生字或擴充查詢) */}
                  <div className="pt-2 border-t border-[rgba(20,26,30,0.08)] space-y-2">
                    <button
                      onClick={handleOnlineLookup}
                      disabled={isOnlineSearching}
                      className="w-full py-2 px-3 rounded-[5px] bg-[#FAF1EB] hover:bg-[#F5E6DD] text-[#D47B38] text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-[rgba(212,123,56,0.2)]"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>
                        {isOnlineSearching
                          ? '正在查詢全球線上辭典...'
                          : `在線上辭典查驗「${searchQuery}」並即時拆解`}
                      </span>
                    </button>

                    {/* 線上查詞結果與一鍵收錄 */}
                    {onlineResult && (
                      <div className="p-3 rounded-[6px] bg-[#F8F9F6] border border-[rgba(20,26,30,0.1)] space-y-2 text-xs animate-fade-in">
                        {onlineResult.found && onlineResult.entry ? (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-[#141A1E]">
                                  {onlineResult.entry.word}
                                </span>
                                {onlineResult.entry.ipa && (
                                  <span className="font-mono text-[#8E99A2]">
                                    {onlineResult.entry.ipa}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-[#1A535C]">
                                {onlineResult.entry.pos.join(' ')}
                              </span>
                            </div>

                            <p className="text-[#5C6770] line-clamp-2">
                              {onlineResult.entry.meanings[0]}
                            </p>

                            {onlineResult.entry.mnemonic && (
                              <div className="flex items-center space-x-1 text-[#1A535C] font-mono text-[11px]">
                                <Sparkles className="w-3 h-3" />
                                <span>{onlineResult.entry.mnemonic}</span>
                              </div>
                            )}

                            <button
                              onClick={handleAddOnlineWordToDeck}
                              className="w-full py-1.5 rounded-[4px] bg-[#1A535C] text-white font-medium flex items-center justify-center space-x-1 hover:bg-[#14424A] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>一鍵收錄進個人生字本 (排入 FSRS 複習)</span>
                            </button>
                          </>
                        ) : (
                          <div className="text-[#C0392B] text-center">
                            {onlineResult.error || '查無此字'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 核心分頁內容載入 (搭配 Suspense 漸進按需渲染) */}
        <section className="flex-1">
          {!isDbReady ? (
            <div className="p-8 text-center text-xs text-[#8E99A2]">詞庫資料庫啟動中...</div>
          ) : (
            <Suspense fallback={<TabLoadingFallback />}>
              {activeTab === 'flashcard' && (
                <FlashcardStudy
                  initialWordId={selectedWordId}
                  onSelectWord={handleSelectWord}
                />
              )}
              {activeTab === 'roots' && <RootsExplorer onSelectWord={handleSelectWord} />}
              {activeTab === 'clips' && <ClipsExplorer onSelectWord={handleSelectWord} />}
              {activeTab === 'quiz' && (
                <QuizCenter onNavigateToStudy={() => setActiveTab('flashcard')} />
              )}
              {activeTab === 'stats' && <StatsView />}
              {activeTab === 'settings' && <SettingsView />}
            </Suspense>
          )}
        </section>
      </main>

      {/* 底部導航欄 */}
      <nav className="sticky bottom-0 z-20 bg-white border-t border-[rgba(20,26,30,0.12)] px-2 sm:px-4 py-1.5 shadow-sm">
        <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 sm:gap-1">
          <button
            onClick={() => setActiveTab('flashcard')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'flashcard'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>背單字</span>
          </button>
          <button
            onClick={() => setActiveTab('roots')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'roots'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <GitFork className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>詞根樹</span>
          </button>
          <button
            onClick={() => setActiveTab('clips')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'clips'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <Film className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>影劇片段</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'quiz'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <Brain className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>測驗</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>進度</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center py-1.5 px-0.5 rounded-[5px] text-[11px] sm:text-xs transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'text-[#1A535C] font-semibold bg-[#ECEAE2]'
                : 'text-[#5C6770] hover:text-[#141A1E]'
            }`}
          >
            <Settings className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
            <span>設定</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
