import { useState, useEffect } from 'react'
import { GitFork, BookOpen, Layers, Search, X } from 'lucide-react'
import type { RootMorpheme, WordEntry } from '../types/lexiclip'
import { morphemeService, type DetailedMorpheme } from '../services/morphemeService'

export interface RootsExplorerProps {
  onSelectWord: (wordId: string) => void
}

export function RootsExplorer({ onSelectWord }: RootsExplorerProps) {
  const [roots, setRoots] = useState<RootMorpheme[]>([])
  const [selectedMorpheme, setSelectedMorpheme] = useState<DetailedMorpheme | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'prefix' | 'root' | 'suffix'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadRoots()
  }, [])

  const loadRoots = async () => {
    // 直接從資料庫取得全部詞根
    const result = await morphemeService['database'].roots.toArray()
    setRoots(result)
    if (result.length > 0) {
      const detailed = await morphemeService.getMorphemeWithCognates(result[0].id)
      setSelectedMorpheme(detailed)
    }
  }

  const handleSelectRoot = async (rootId: string) => {
    const detailed = await morphemeService.getMorphemeWithCognates(rootId)
    setSelectedMorpheme(detailed)
  }

  const filteredRoots = roots.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType
    const q = searchQuery.trim().toLowerCase()
    if (!q) return matchesType
    const matchesQuery =
      r.morpheme.toLowerCase().includes(q) ||
      r.meaningZh.includes(q) ||
      r.meaning.toLowerCase().includes(q)
    return matchesType && matchesQuery
  })

  const typeNameMap = {
    prefix: '前綴 (Prefix)',
    root: '核心字根 (Root)',
    suffix: '後綴 (Suffix)',
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* 左側詞根列表 */}
      <div className="w-full md:w-80 bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,26,30,0.08)]">
          <div className="flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-[#1A535C]" />
            <h2 className="text-sm font-semibold text-[#141A1E]">詞根字源家族</h2>
          </div>
          <span className="text-xs font-mono text-[#8E99A2]">{filteredRoots.length} 筆</span>
        </div>

        {/* 類型篩選標籤 (2px 微型圓角 / 膠囊) */}
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#ECEAE2] rounded-[5px] text-xs">
          {(['all', 'prefix', 'root', 'suffix'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`py-1 rounded-[4px] font-medium transition-colors cursor-pointer text-center ${
                filterType === type
                  ? 'bg-white text-[#1A535C] shadow-2xs'
                  : 'text-[#5C6770] hover:text-[#141A1E]'
              }`}
            >
              {type === 'all' ? '全部' : type === 'prefix' ? '前綴' : type === 'root' ? '字根' : '後綴'}
            </button>
          ))}
        </div>

        {/* 詞根快速即時搜尋框 */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E99A2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋詞根或中文含義 (如 chron, 時間)..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-[5px] bg-[#F6F5F0] border border-[rgba(20,26,30,0.1)] focus:outline-none focus:border-[#1A535C] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E99A2] hover:text-[#141A1E] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 詞根滑動選單 (微型捲軸) */}
        <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[460px] pr-1">
          {filteredRoots.map((r) => {
            const isSelected = selectedMorpheme?.id === r.id
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRoot(r.id)}
                className={`w-full text-left p-2.5 rounded-[6px] border transition-colors cursor-pointer flex flex-col space-y-0.5 ${
                  isSelected
                    ? 'bg-[#1A535C] text-white border-[#1A535C]'
                    : 'bg-[#FDFDFB] hover:bg-[#ECEAE2] text-[#141A1E] border-[rgba(20,26,30,0.08)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm">{r.morpheme}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono ${
                      isSelected ? 'bg-[#14424A] text-[#EDF2F4]' : 'bg-[#ECEAE2] text-[#5C6770]'
                    }`}
                  >
                    {r.type}
                  </span>
                </div>
                <div className={`text-xs truncate ${isSelected ? 'text-[#D0E2E5]' : 'text-[#5C6770]'}`}>
                  {r.meaningZh} ({r.meaning})
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右側詞根詳細與同源詞家族展開 */}
      <div className="flex-1 bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-5 shadow-xs flex flex-col space-y-4">
        {selectedMorpheme ? (
          <>
            <div className="border-b border-[rgba(20,26,30,0.08)] pb-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold font-mono text-[#1A535C]">
                  {selectedMorpheme.morpheme}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-[2px] bg-[#ECEAE2] text-[#1A535C] font-mono">
                  {typeNameMap[selectedMorpheme.type]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C6770]">
                <div>
                  <span className="font-medium text-[#141A1E]">來源：</span> {selectedMorpheme.origin}
                </div>
                <div>
                  <span className="font-medium text-[#141A1E]">字根釋義：</span> {selectedMorpheme.meaningZh} ({selectedMorpheme.meaning})
                </div>
              </div>
            </div>

            {/* 同源單字群 (Cognate Words) */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#141A1E]">
                  <Layers className="w-4 h-4 text-[#1A535C]" />
                  <span>衍生同源單字群 (Cognates)</span>
                </div>
                <span className="text-xs text-[#8E99A2]">共 {selectedMorpheme.cognateWords.length} 個單字</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedMorpheme.cognateWords.map((cw: WordEntry) => (
                  <div
                    key={cw.id}
                    className="p-3 rounded-[6px] border border-[rgba(20,26,30,0.08)] bg-[#FDFDFB] hover:border-[#1A535C] transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#141A1E]">{cw.word}</span>
                        <span className="text-[10px] text-[#8E99A2] font-mono">{cw.levelTag}</span>
                      </div>
                      {cw.ipa && <div className="text-xs text-[#8E99A2] font-mono">{cw.ipa}</div>}
                      <div className="text-xs text-[#5C6770] mt-1 line-clamp-2">
                        {cw.meaningsZh.join('； ')}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectWord(cw.id)}
                      className="self-end inline-flex items-center space-x-1 text-xs text-[#1A535C] hover:underline font-medium cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>進入單字卡</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#8E99A2]">
            請從左側點選詞根以檢視同源詞家族
          </div>
        )}
      </div>
    </div>
  )
}
