import { useState, useEffect } from 'react'
import { Film, Play, BookOpen, Layers, Search, X } from 'lucide-react'
import type { MediaClip, WordEntry, LearningTopic } from '../types/lexiclip'
import { db } from '../db/lexiclipDatabase'
import { ClipPlayer } from './ClipPlayer'

export interface ClipsExplorerProps {
  onSelectWord: (wordId: string) => void
}

const TOPIC_FILTERS: { id: LearningTopic; label: string }[] = [
  { id: 'all', label: '全部語料' },
  { id: 'daily', label: '生活日常' },
  { id: 'animation', label: '皮克斯/動畫' },
  { id: 'sci-fi', label: '科幻/未來' },
  { id: 'cinema', label: '影視名場面' },
  { id: 'sitcom', label: '生活喜劇' },
  { id: 'business', label: '演講/商業' },
]

export function ClipsExplorer({ onSelectWord }: ClipsExplorerProps) {
  const [clips, setClips] = useState<MediaClip[]>([])
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic>('all')
  const [selectedClip, setSelectedClip] = useState<MediaClip | null>(null)
  const [wordsMap, setWordsMap] = useState<Map<string, WordEntry>>(new Map())
  const [clipSearch, setClipSearch] = useState('')

  useEffect(() => {
    loadClips()
  }, [])

  const loadClips = async () => {
    const allClips = await db.clips.toArray()
    const allWords = await db.words.toArray()
    setClips(allClips)
    setWordsMap(new Map(allWords.map((w) => [w.id, w])))
    if (allClips.length > 0) {
      setSelectedClip(allClips[0])
    }
  }

  const filteredClips = clips.filter((c) => {
    const matchesTopic = selectedTopic === 'all' || c.topic === selectedTopic
    const q = clipSearch.trim().toLowerCase()
    if (!q) return matchesTopic
    const w = wordsMap.get(c.wordId)?.word.toLowerCase() || ''
    const matchesQuery =
      c.title.toLowerCase().includes(q) ||
      (c.sourceName && c.sourceName.toLowerCase().includes(q)) ||
      c.transcript.toLowerCase().includes(q) ||
      c.transcriptZh.includes(q) ||
      w.includes(q)
    return matchesTopic && matchesQuery
  })

  const currentWord = selectedClip ? wordsMap.get(selectedClip.wordId) : null

  return (
    <div className="space-y-4">
      {/* 頂部主題分類標籤與片段檢索 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-[#5C6770] shrink-0">分類精選：</span>
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-[6px] border border-[rgba(20,26,30,0.1)]">
            {TOPIC_FILTERS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopic(t.id)
                  const matched = clips.filter((c) => t.id === 'all' || c.topic === t.id)
                  if (matched.length > 0) {
                    setSelectedClip(matched[0])
                  }
                }}
                className={`px-2.5 py-1 text-xs rounded-[4px] font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedTopic === t.id
                    ? 'bg-[#1A535C] text-white shadow-2xs'
                    : 'text-[#5C6770] hover:text-[#141A1E]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 影視原聲片段快速搜尋列 */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E99A2]" />
          <input
            type="text"
            value={clipSearch}
            onChange={(e) => setClipSearch(e.target.value)}
            placeholder="搜尋片名、台詞或單字..."
            className="w-full pl-8 pr-7 py-1 text-xs rounded-[5px] bg-white border border-[rgba(20,26,30,0.1)] focus:outline-none focus:border-[#1A535C] transition-colors"
          />
          {clipSearch && (
            <button
              onClick={() => setClipSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E99A2] hover:text-[#141A1E] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 播放器聚焦展示區 */}
      {selectedClip && (
        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-[#1A535C]" />
              <h2 className="text-sm font-semibold text-[#141A1E]">目前播放片段</h2>
              {selectedClip.sourceName && (
                <span className="text-[11px] font-mono text-[#8E99A2]">
                  · {selectedClip.sourceName}
                </span>
              )}
            </div>
            {currentWord && (
              <button
                onClick={() => onSelectWord(currentWord.id)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-[5px] bg-[#ECEAE2] text-[#1A535C] text-xs font-medium hover:bg-[#E0DDD3] transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>背此單字卡: {currentWord.word}</span>
              </button>
            )}
          </div>

          <ClipPlayer clips={[selectedClip]} targetWord={currentWord?.word || ''} />
        </div>
      )}

      {/* 片段卡片矩陣探索 */}
      <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(20,26,30,0.08)]">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#1A535C]" />
            <span className="text-xs font-semibold text-[#141A1E]">
              {selectedTopic === 'all'
                ? '全部精選影視與動畫語境片段'
                : `【${TOPIC_FILTERS.find((t) => t.id === selectedTopic)?.label}】語料清單`}
            </span>
          </div>
          <span className="text-xs font-mono text-[#8E99A2]">{filteredClips.length} 部片段</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredClips.map((clip) => {
            const word = wordsMap.get(clip.wordId)
            const isSelected = selectedClip?.id === clip.id

            return (
              <div
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                className={`p-3 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-[#1A535C] bg-[#F4F8F8] shadow-2xs'
                    : 'border-[rgba(20,26,30,0.08)] bg-[#FDFDFB] hover:border-[#1A535C]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#141A1E] truncate max-w-[70%]">
                      {clip.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#8E99A2]">
                      {clip.startSec}s - {clip.endSec}s
                    </span>
                  </div>

                  {clip.sourceName && (
                    <div className="text-[10px] font-mono text-[#1A535C] mt-0.5">
                      出處：{clip.sourceName}
                    </div>
                  )}

                  {/* 英文台詞 */}
                  <p className="text-xs text-[#5C6770] mt-1.5 line-clamp-2 italic">
                    "{clip.transcript}"
                  </p>
                  {/* 中文對照翻譯 */}
                  {clip.transcriptZh && (
                    <p className="text-[11px] text-[#8E99A2] mt-0.5 line-clamp-2">
                      {clip.transcriptZh}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[rgba(20,26,30,0.06)]">
                  <span className="text-[11px] font-mono text-[#1A535C] font-semibold">
                    目標詞：{word?.word || clip.wordId}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-[#1A535C] font-medium">
                    <Play className="w-3 h-3 fill-current" />
                    <span>播放原聲</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
