import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { ClipPlayer } from './ClipPlayer'
import type { MediaClip } from '../types/lexiclip'

describe('T5: YouTube 片段播放器與降級引擎', () => {
  const mockClips: MediaClip[] = [
    {
      id: 'c_test_1',
      wordId: 'w_synchronize',
      videoId: 'a3lcGnMhvsA',
      title: 'Interstellar Docking',
      startSec: 72.0,
      endSec: 86.5,
      transcript: 'Synchronize our rotation with the station!',
      transcriptZh: '使我們的旋轉速度與太空站同步！',
      status: 'active',
    },
    {
      id: 'c_test_2',
      wordId: 'w_synchronize',
      videoId: 'backup_vid_2',
      title: 'Backup Clip',
      startSec: 10.0,
      endSec: 20.0,
      transcript: 'We need to synchronize our watches.',
      transcriptZh: '我們需要對時。',
      status: 'active',
    },
  ]

  it('應正確渲染 YouTube IFrame 與目標單字高亮標籤', () => {
    render(<ClipPlayer clips={mockClips} targetWord="synchronize" />)

    const iframe = screen.getByTitle('Interstellar Docking')
    expect(iframe).toBeInTheDocument()
    expect(iframe.getAttribute('src')).toContain('a3lcGnMhvsA')

    // 驗證高亮標籤 <mark>
    const markElement = screen.getByText('Synchronize')
    expect(markElement.tagName.toLowerCase()).toBe('mark')
  })

  it('點擊「影片無法播放？」時應觸發備援片段切換或 TTS 降級', () => {
    const handleStatusChange = vi.fn()
    render(
      <ClipPlayer
        clips={mockClips}
        targetWord="synchronize"
        onClipStatusChange={handleStatusChange}
      />
    )

    const unplayableBtn = screen.getByRole('button', { name: /影片無法播放/i })
    fireEvent.click(unplayableBtn)

    expect(handleStatusChange).toHaveBeenCalledWith('c_test_1', 'unplayable')
  })

  it('在無有效影片片段時應自動降級為 TTS 語音朗讀模式', () => {
    render(<ClipPlayer clips={[]} targetWord="synchronize" />)

    expect(screen.getByText(/語境語音降級模式/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /朗讀台詞/i })).toBeInTheDocument()
  })

  it('當提供 localVideoUrl 時應支援切換至本機 HTML5 微影片播放', () => {
    const localClips: MediaClip[] = [
      {
        id: 'c_local_1',
        wordId: 'w_commute',
        videoId: 'vid_dummy',
        title: 'Morning Commute',
        startSec: 0,
        endSec: 5,
        transcript: 'I commute every day.',
        transcriptZh: '我每天通勤。',
        localVideoUrl: '/videos/daily_commute.webm',
        status: 'active',
      },
    ]

    render(<ClipPlayer clips={localClips} targetWord="commute" />)

    // 初始線上狀態渲染 iframe
    expect(screen.getByTitle('Morning Commute')).toBeInTheDocument()

    // 尋找離線微影片切換按鈕
    const toggleBtn = screen.getByRole('button', { name: /離線微影片/i })
    expect(toggleBtn).toBeInTheDocument()

    // 點擊切換為本機離線微影片
    fireEvent.click(toggleBtn)

    // 應渲染原生 HTML5 video 標籤
    const video = screen.getByLabelText(/本機離線影片/i)
    expect(video).toBeInTheDocument()
    expect(video.getAttribute('src')).toBe('/videos/daily_commute.webm')
  })
})
