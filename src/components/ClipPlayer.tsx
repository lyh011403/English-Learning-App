import { useState, useEffect, useRef } from 'react'
import { RotateCcw, Volume2, AlertTriangle, ShieldCheck, HardDrive, Wifi } from 'lucide-react'
import type { MediaClip } from '../types/lexiclip'
import { ttsService } from '../services/ttsService'

export interface ClipPlayerProps {
  clips: MediaClip[]
  targetWord: string
  onClipStatusChange?: (clipId: string, status: 'active' | 'unplayable') => void
}

export function ClipPlayer({ clips, targetWord, onClipStatusChange }: ClipPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTTSMode, setIsTTSMode] = useState(false)
  const [useLocalVideo, setUseLocalVideo] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const activeClips = clips.filter((c) => c.status !== 'unplayable')
  const currentClip = activeClips[currentIndex] || clips[0]

  useEffect(() => {
    // 重置片段索引
    setCurrentIndex(0)
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

    if (!currentClip) {
      setIsTTSMode(true)
      setUseLocalVideo(false)
    } else if (isOffline) {
      if (currentClip.localVideoUrl) {
        // 離線但有本機微影片：直接優先使用本機微影片
        setUseLocalVideo(true)
        setIsTTSMode(false)
      } else {
        // 離線且無本機微影片：降級至 TTS
        setIsTTSMode(true)
        setUseLocalVideo(false)
      }
    } else {
      // 線上狀態：預設依是否有 localVideoUrl 或保持串流模式
      setIsTTSMode(false)
      setUseLocalVideo(false)
    }
  }, [clips, currentClip])

  // 目標單字高亮渲染器
  const renderHighlightedTranscript = (text: string, highlight: string) => {
    if (!text || !highlight) return text
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === highlight.toLowerCase()
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-[#1A535C] text-white px-1.5 py-0.5 rounded-[2px] font-semibold"
          >
            {part}
          </mark>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  // 播放 TTS 語音朗讀
  const handlePlayTTS = async () => {
    if (!currentClip) {
      await ttsService.speak(targetWord)
      return
    }
    setIsPlayingTTS(true)
    await ttsService.speak(currentClip.transcript)
    setIsPlayingTTS(false)
  }

  // 標記當前影片為無法播放並切換備援或降級
  const handleMarkUnplayable = () => {
    if (!currentClip) return
    onClipStatusChange?.(currentClip.id, 'unplayable')

    if (activeClips.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % (activeClips.length - 1))
    } else if (currentClip.localVideoUrl) {
      // YouTube 失敗時，若有本機微影片則無縫切換本機播放
      setUseLocalVideo(true)
    } else {
      setIsTTSMode(true)
    }
  }

  // 重新跳轉至片段起始時間
  const handleReplaySegment = () => {
    if (useLocalVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      return
    }

    if (iframeRef.current && currentClip) {
      iframeRef.current.src = `https://www.youtube.com/embed/${currentClip.videoId}?start=${Math.floor(
        currentClip.startSec
      )}&end=${Math.ceil(currentClip.endSec)}&autoplay=1&enablejsapi=1`
    }
  }

  if (!currentClip || isTTSMode) {
    return (
      <div className="bg-[#142026] text-[#EDF2F4] rounded-[9px] p-4 border border-[#223038] flex flex-col space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8E99A2]">
          <span className="flex items-center space-x-1.5 text-[#D47B38]">
            <AlertTriangle className="w-4 h-4" />
            <span>語境語音降級模式 (Offline / Fallback TTS)</span>
          </span>
          <span className="font-mono">原聲台詞學習</span>
        </div>

        <div className="bg-[#0D161A] p-3 rounded-[6px] border border-[#1A262E] space-y-2">
          <p className="text-sm md:text-base leading-relaxed text-[#EDF2F4]">
            "{renderHighlightedTranscript(currentClip?.transcript || `Example for ${targetWord}`, targetWord)}"
          </p>
          {currentClip?.transcriptZh && (
            <p className="text-xs text-[#8E99A2] leading-normal">{currentClip.transcriptZh}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePlayTTS}
            disabled={isPlayingTTS}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-[5px] bg-[#1A535C] text-white text-xs font-medium hover:bg-[#14424A] transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingTTS ? '朗讀中...' : '朗讀台詞 (TTS)'}</span>
          </button>
          {clips.length > 0 && isTTSMode && (
            <button
              onClick={() => {
                if (currentClip?.localVideoUrl) {
                  setUseLocalVideo(true)
                  setIsTTSMode(false)
                } else {
                  setIsTTSMode(false)
                }
              }}
              className="text-xs text-[#8E99A2] hover:text-white transition-colors cursor-pointer"
            >
              嘗試恢復影片播放
            </button>
          )}
        </div>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${currentClip.videoId}?start=${Math.floor(
    currentClip.startSec
  )}&end=${Math.ceil(currentClip.endSec)}&enablejsapi=1&rel=0`

  return (
    <div className="bg-[#0D161A] text-[#EDF2F4] rounded-[9px] overflow-hidden border border-[#223038] flex flex-col shadow-xs">
      {/* 頂部標題列與備援切換 */}
      <div className="px-3 py-2 bg-[#142026] flex items-center justify-between text-xs text-[#8E99A2] border-b border-[#1E2D35]">
        <div className="flex items-center space-x-1.5 truncate max-w-[65%]">
          {useLocalVideo ? (
            <HardDrive className="w-3.5 h-3.5 text-[#E76F51] shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-[#2A9D8F] shrink-0" />
          )}
          <span className="truncate">
            {currentClip.title} {useLocalVideo && '(本機微影片包)'}
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {/* 若有本機微影片資源，提供切換本機/線上按鈕 */}
          {currentClip.localVideoUrl && (
            <button
              onClick={() => setUseLocalVideo((prev) => !prev)}
              title={useLocalVideo ? '切換至 YouTube 線上原片' : '切換至本機離線微影片 (免連線)'}
              className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-medium transition-colors cursor-pointer ${
                useLocalVideo
                  ? 'bg-[#E76F51]/20 text-[#E76F51] border border-[#E76F51]/40'
                  : 'bg-[#1E2E38] text-[#8E99A2] hover:text-white'
              }`}
            >
              {useLocalVideo ? <Wifi className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
              <span>{useLocalVideo ? '線上串流' : '離線微影片'}</span>
            </button>
          )}

          <span className="font-mono text-[11px]">
            {currentClip.startSec}s - {currentClip.endSec}s
          </span>
          {activeClips.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeClips.length)}
              className="text-xs text-[#A5B4BF] hover:text-white underline cursor-pointer"
            >
              切換片段 ({currentIndex + 1}/{activeClips.length})
            </button>
          )}
        </div>
      </div>

      {/* 影片播放容器 (16:9 比例) */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        {useLocalVideo && currentClip.localVideoUrl ? (
          <video
            ref={videoRef}
            src={currentClip.localVideoUrl}
            controls
            playsInline
            loop
            aria-label={`本機離線影片: ${currentClip.title}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={currentClip.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* 影劇原聲台詞與控制區 */}
      <div className="p-3 bg-[#142026] space-y-2 border-t border-[#1E2D35]">
        <div className="space-y-1">
          <p className="text-sm leading-relaxed text-[#EDF2F4]">
            "{renderHighlightedTranscript(currentClip.transcript, targetWord)}"
          </p>
          {currentClip.transcriptZh && (
            <p className="text-xs text-[#8E99A2] leading-normal">{currentClip.transcriptZh}</p>
          )}
        </div>

        {/* 播放控制按鈕群 (4-6px 圓角) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReplaySegment}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-[5px] bg-[#1E2E38] text-xs text-[#EDF2F4] hover:bg-[#283C48] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重播片段</span>
            </button>
            <button
              onClick={handlePlayTTS}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-[5px] bg-[#1E2E38] text-xs text-[#EDF2F4] hover:bg-[#283C48] transition-colors cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>朗讀台詞</span>
            </button>
          </div>

          <button
            onClick={handleMarkUnplayable}
            className="text-xs text-[#8E99A2] hover:text-[#E76F51] transition-colors cursor-pointer"
            title="若影片作者禁止嵌入或無法載入，點此切換至備援或 TTS"
          >
            影片無法播放？
          </button>
        </div>
      </div>
    </div>
  )
}
