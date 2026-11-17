import { useState, useEffect } from 'react'
import { Award, Clock, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import { fsrsScheduler, type LearningStats } from '../services/fsrsScheduler'

export function StatsView() {
  const [stats, setStats] = useState<LearningStats | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const data = await fsrsScheduler.getLearningStats()
    setStats(data)
  }

  if (!stats) {
    return <div className="p-6 text-center text-xs text-[#8E99A2]">載入統計數據中...</div>
  }

  const reviewPercent = stats.totalWords > 0 ? Math.round((stats.reviewCards / stats.totalWords) * 100) : 0
  const learningPercent = stats.totalWords > 0 ? Math.round((stats.learningCards / stats.totalWords) * 100) : 0
  const newPercent = 100 - reviewPercent - learningPercent

  return (
    <div className="space-y-4">
      {/* 頂部核心指標卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#5C6770]">
            <Clock className="w-3.5 h-3.5 text-[#D47B38]" />
            <span>今日待複習</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#141A1E]">{stats.dueToday}</div>
          <div className="text-[10px] text-[#8E99A2]">依 FSRS 遺忘曲線排程</div>
        </div>

        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#5C6770]">
            <CheckCircle className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span>累計複習次數</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#141A1E]">{stats.totalReviews}</div>
          <div className="text-[10px] text-[#8E99A2]">全歷史評分記錄</div>
        </div>

        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#5C6770]">
            <BookOpen className="w-3.5 h-3.5 text-[#1A535C]" />
            <span>已收錄單字庫</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#141A1E]">{stats.totalWords}</div>
          <div className="text-[10px] text-[#8E99A2]">詞根家族化單字</div>
        </div>

        <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-4 shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-[#5C6770]">
            <Award className="w-3.5 h-3.5 text-[#E76F51]" />
            <span>長期掌握率</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#141A1E]">{reviewPercent}%</div>
          <div className="text-[10px] text-[#8E99A2]">已進入穩固複習期</div>
        </div>
      </div>

      {/* 掌握度分佈長條圖與分級指標 */}
      <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#1A535C]" />
            <h3 className="text-sm font-semibold text-[#141A1E]">記憶狀態分佈 (Memory Retention)</h3>
          </div>
          <span className="text-xs text-[#8E99A2]">FSRS 演算法評估</span>
        </div>

        {/* 視覺化進度條 */}
        <div className="w-full h-3 rounded-[3px] bg-[#ECEAE2] overflow-hidden flex">
          <div
            style={{ width: `${reviewPercent}%` }}
            className="bg-[#2A9D8F] h-full transition-all"
            title={`穩固複習期: ${stats.reviewCards} 個`}
          />
          <div
            style={{ width: `${learningPercent}%` }}
            className="bg-[#D47B38] h-full transition-all"
            title={`學習中: ${stats.learningCards} 個`}
          />
          <div
            style={{ width: `${newPercent}%` }}
            className="bg-[#C5CCD2] h-full transition-all"
            title={`新單字: ${stats.newCards} 個`}
          />
        </div>

        {/* 圖例說明 */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
            <span className="text-[#141A1E] font-medium">熟練期：{stats.reviewCards} 個</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D47B38]" />
            <span className="text-[#141A1E] font-medium">學習中：{stats.learningCards} 個</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5CCD2]" />
            <span className="text-[#141A1E] font-medium">新單字：{stats.newCards} 個</span>
          </div>
        </div>
      </div>
    </div>
  )
}
