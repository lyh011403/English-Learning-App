import React, { useState, useEffect } from 'react'
import { Download, Upload, RefreshCw, Database, ShieldAlert, Check, Target, Compass, Sparkles } from 'lucide-react'
import { db } from '../db/lexiclipDatabase'
import { morphemeService } from '../services/morphemeService'
import { fsrsScheduler } from '../services/fsrsScheduler'
import { sanitizeFileName } from '../utils/sanitizer'
import type { LearningTopic, DailyGoalSetting } from '../types/lexiclip'

const TOPIC_OPTIONS: { id: LearningTopic; label: string }[] = [
  { id: 'all', label: '綜合全覽 (All)' },
  { id: 'daily', label: '生活日常 (Daily Life)' },
  { id: 'animation', label: '皮克斯/經典動畫 (Animation)' },
  { id: 'sci-fi', label: '科幻/未來科技 (Sci-Fi)' },
  { id: 'cinema', label: '影視名場面 (Cinema)' },
  { id: 'sitcom', label: '生活喜劇 (Sitcom)' },
  { id: 'business', label: '演講/商業職場 (Business)' },
]

export function SettingsView() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dailySettings, setDailySettings] = useState<DailyGoalSetting>({
    targetNewCards: 10,
    preferredTopic: 'all',
    autoPlayAudio: true,
  })

  useEffect(() => {
    const s = fsrsScheduler.getDailySettings()
    setDailySettings(s)
  }, [])

  const showStatus = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(null), 4000)
  }

  const handleUpdateTarget = (targetNewCards: number) => {
    const updated = { ...dailySettings, targetNewCards }
    setDailySettings(updated)
    fsrsScheduler.saveDailySettings(updated)
    showStatus(`已更新每日新詞目標為 ${targetNewCards} 個單字`)
  }

  const handleUpdateTopic = (preferredTopic: LearningTopic) => {
    const updated = { ...dailySettings, preferredTopic }
    setDailySettings(updated)
    fsrsScheduler.saveDailySettings(updated)
    showStatus(`已切換預設學習主題為：${TOPIC_OPTIONS.find((t) => t.id === preferredTopic)?.label}`)
  }

  // 強制補滿與同步原廠種子詞庫
  const handleReloadLatestSeed = async () => {
    try {
      setIsProcessing(true)
      await morphemeService.seedDatabaseIfEmpty(true)
      showStatus('已成功將最新影視動畫片段與詞根資源同步至本機庫')
    } catch (err) {
      console.error(err)
      showStatus('同步失敗')
    } finally {
      setIsProcessing(false)
    }
  }

  // 匯入分片詞庫 (Chunked Vocab)
  const handleImportChunk = async (filename: string, label: string) => {
    try {
      setIsProcessing(true)
      const count = await morphemeService.importChunkedVocab(filename)
      showStatus(`成功載入【${label}】，新增 ${count} 個高頻單字至學習佇列！`)
    } catch (err) {
      console.error(err)
      showStatus(`載入【${label}】失敗，請檢查網路連線`)
    } finally {
      setIsProcessing(false)
    }
  }

  // 匯出 JSON 備份
  const handleExportBackup = async () => {
    try {
      setIsProcessing(true)
      const words = await db.words.toArray()
      const roots = await db.roots.toArray()
      const clips = await db.clips.toArray()
      const cardStates = await db.cardStates.toArray()
      const reviewLogs = await db.reviewLogs.toArray()

      const backupData = {
        version: '1.2',
        exportedAt: new Date().toISOString(),
        words,
        roots,
        clips,
        cardStates,
        reviewLogs,
      }

      const jsonStr = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const filename = sanitizeFileName(`lexiclip_backup_${new Date().toISOString().slice(0, 10)}.json`)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      showStatus('備份檔案已成功匯出')
    } catch (err) {
      console.error(err)
      showStatus('匯出失敗，請重試')
    } finally {
      setIsProcessing(false)
    }
  }

  // 匯入 JSON 備份
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      showStatus('檔案過大，備份檔案上限為 10MB')
      return
    }

    try {
      setIsProcessing(true)
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.words || !data.cardStates) {
        showStatus('無效的備份檔案格式')
        return
      }

      await db.transaction('rw', db.words, db.roots, db.clips, db.cardStates, db.reviewLogs, async () => {
        if (data.words.length) await db.words.bulkPut(data.words)
        if (data.roots?.length) await db.roots.bulkPut(data.roots)
        if (data.clips?.length) await db.clips.bulkPut(data.clips)
        if (data.cardStates.length) await db.cardStates.bulkPut(data.cardStates)
        if (data.reviewLogs?.length) await db.reviewLogs.bulkPut(data.reviewLogs)
      })

      showStatus('備份資料已成功匯入與還原')
    } catch (err) {
      console.error(err)
      showStatus('匯入解析失敗，請確認檔案格式')
    } finally {
      setIsProcessing(false)
      e.target.value = ''
    }
  }

  // 重置資料庫
  const handleResetDatabase = async () => {
    if (!window.confirm('確定要重置資料庫並重新載入原廠種子詞庫嗎？這將覆蓋現有進度。')) {
      return
    }

    try {
      setIsProcessing(true)
      await db.words.clear()
      await db.roots.clear()
      await db.clips.clear()
      await db.cardStates.clear()
      await db.reviewLogs.clear()
      await db.outbox.clear()

      await morphemeService.seedDatabaseIfEmpty(true)
      showStatus('資料庫已重置並重新載入全部種子詞庫')
    } catch (err) {
      console.error(err)
      showStatus('重置失敗')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-[9px] border border-[rgba(20,26,30,0.11)] p-5 shadow-xs space-y-6">
      <div className="border-b border-[rgba(20,26,30,0.08)] pb-3">
        <h2 className="text-base font-semibold text-[#141A1E]">學習偏好與資料維護</h2>
        <p className="text-xs text-[#5C6770] mt-0.5">
          自訂您的每日學習目標、偏好主題方向與離線資料備份。
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-[6px] bg-[#EBF5FB] border border-[#2980B9] text-[#2980B9] text-xs font-medium flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 每日學習目標設定 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#141A1E]">
          <Target className="w-4 h-4 text-[#1A535C]" />
          <span>每日新單字目標量</span>
        </div>

        <div className="flex items-center space-x-2">
          {[5, 10, 15, 20, 30].map((count) => (
            <button
              key={count}
              onClick={() => handleUpdateTarget(count)}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                dailySettings.targetNewCards === count
                  ? 'bg-[#1A535C] text-white border-[#1A535C]'
                  : 'bg-[#FDFDFB] text-[#5C6770] border-[rgba(20,26,30,0.1)] hover:border-[#1A535C]'
              }`}
            >
              {count} 字/天
            </button>
          ))}
        </div>
      </div>

      {/* 預設學習主題方向 */}
      <div className="space-y-3 pt-4 border-t border-[rgba(20,26,30,0.08)]">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#141A1E]">
          <Compass className="w-4 h-4 text-[#1A535C]" />
          <span>預設學習主題方向</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPIC_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleUpdateTopic(t.id)}
              className={`p-2.5 rounded-[6px] text-xs text-left border transition-all cursor-pointer flex items-center justify-between ${
                dailySettings.preferredTopic === t.id
                  ? 'bg-[#F4F8F8] border-[#1A535C] text-[#1A535C] font-semibold'
                  : 'bg-[#FDFDFB] border-[rgba(20,26,30,0.08)] text-[#5C6770] hover:border-[#1A535C]'
              }`}
            >
              <span>{t.label}</span>
              {dailySettings.preferredTopic === t.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 分級單字擴充包 */}
      <div className="space-y-3 pt-4 border-t border-[rgba(20,26,30,0.08)]">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#141A1E]">
          <Sparkles className="w-4 h-4 text-[#1A535C]" />
          <span>分級單字擴充庫 (按需下載入庫)</span>
        </div>
        <p className="text-xs text-[#5C6770]">
          可依據目前學習方向，一鍵擴充官方預先整理的分級詞庫，立即排入 FSRS 複習佇列。
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleImportChunk('master-lexicon.json', '全量 6,668 核心單字庫 (含 2,659 生活日常高頻詞/托福/四六級/詞根網絡)')}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-[5px] bg-[#10262C] hover:bg-[#1A3840] text-[#F8F9F6] text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>一鍵匯入【全量 6,668 核心單字庫 (含 2,659 生活日常詞)】</span>
          </button>

          <button
            onClick={() => handleImportChunk('toefl-core.json', '托福學術核心詞庫')}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#EBF5FB] hover:bg-[#D4E6F1] text-[#2980B9] border border-[rgba(41,128,185,0.25)] text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯入【托福學術核心詞庫】</span>
          </button>

          <button
            onClick={() => handleImportChunk('cinema-daily.json', '影視美劇生活詞庫')}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#EAFAF1] hover:bg-[#D5F5E3] text-[#27AE60] border border-[rgba(39,174,96,0.25)] text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯入【影視美劇生活詞庫】</span>
          </button>
        </div>
      </div>

      {/* 原廠資源補齊與備份 */}
      <div className="space-y-3 pt-4 border-t border-[rgba(20,26,30,0.08)]">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#141A1E]">
          <Database className="w-4 h-4 text-[#1A535C]" />
          <span>資源同步與備份</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleReloadLatestSeed}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#FAF1EB] hover:bg-[#F5E6DD] text-[#D47B38] border border-[rgba(212,123,56,0.25)] text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>補滿最新影視與詞根庫 (無損同步)</span>
          </button>

          <button
            onClick={handleExportBackup}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#ECEAE2] hover:bg-[#E0DDD3] text-[#141A1E] text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1A535C]" />
            <span>匯出學習進度 JSON</span>
          </button>

          <label className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#ECEAE2] hover:bg-[#E0DDD3] text-[#141A1E] text-xs font-medium transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#1A535C]" />
            <span>匯入還原 JSON 備份</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              disabled={isProcessing}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 資料庫健康度與重置 */}
      <div className="pt-4 border-t border-[rgba(20,26,30,0.08)] space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#C0392B]">
          <ShieldAlert className="w-4 h-4" />
          <span>資料重置區</span>
        </div>

        <p className="text-xs text-[#5C6770]">
          若欲完全清空本機學習排程與自訂紀錄，可點此清空資料庫並重新載入原廠種子詞庫。
        </p>

        <button
          onClick={handleResetDatabase}
          disabled={isProcessing}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-[5px] bg-[#FAF0ED] hover:bg-[#F5DFD9] text-[#C0392B] border border-[rgba(192,57,43,0.2)] text-xs font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置資料庫並載入原廠種子詞庫</span>
        </button>
      </div>
    </div>
  )
}
