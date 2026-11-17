import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { QuizCenter } from './QuizCenter'

// 模擬 fsrsScheduler
vi.mock('../services/fsrsScheduler', () => ({
  fsrsScheduler: {
    reviewCard: vi.fn().mockResolvedValue({
      updatedState: {
        wordId: 'w_test',
        state: 1,
        due: new Date().toISOString(),
      },
    }),
  },
}))

describe('QuizCenter 智能練習題測驗中心', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('應正確渲染測驗設定卡片與題目規模選擇', async () => {
    render(<QuizCenter />)

    expect(await screen.findByText('智能練習題測驗中心')).toBeInTheDocument()
    expect(screen.getByText('快速快問快答')).toBeInTheDocument()
    expect(screen.getByText('標準模擬測驗')).toBeInTheDocument()
    expect(screen.getByText('深度刷題馬拉松')).toBeInTheDocument()
    expect(screen.getByText(/啟動演算法出題/)).toBeInTheDocument()
  })

  it('選擇「英中核心字義」後啟動出題，應展示選擇題選項並完成作答與解析', async () => {
    render(<QuizCenter />)

    // 切換為字義選擇題專項
    const vocabCatBtn = await screen.findByText('英中核心字義')
    fireEvent.click(vocabCatBtn)

    const startBtn = screen.getByText(/啟動演算法出題/)
    fireEvent.click(startBtn)

    await waitFor(() => {
      expect(screen.getByText(/難度標籤/)).toBeInTheDocument()
    })

    // 檢查是否有發音按鈕
    expect(screen.getByRole('button', { name: /發音/i })).toBeInTheDocument()

    // 尋找選項按鈕
    const optionButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.textContent?.includes('發音') && !b.textContent?.includes('重設條件'))

    expect(optionButtons.length).toBeGreaterThanOrEqual(2)
    fireEvent.click(optionButtons[0])

    await waitFor(() => {
      expect(screen.getByText(/回答正確！|答錯了/)).toBeInTheDocument()
    })

    // 檢查下一題按鈕
    const nextBtn = screen.getByText(/下一題|查看總結報告/)
    expect(nextBtn).toBeInTheDocument()
  })

  it('選擇「詞根磁貼拼裝」後啟動出題，應可點選磁貼並提交拼裝答案', async () => {
    render(<QuizCenter />)

    // 切換為詞根磁貼專項
    const rootsCatBtn = await screen.findByText('詞根磁貼拼裝')
    fireEvent.click(rootsCatBtn)

    const startBtn = screen.getByText(/啟動演算法出題/)
    fireEvent.click(startBtn)

    await waitFor(() => {
      expect(screen.getByText(/依序點擊詞根磁貼/)).toBeInTheDocument()
    })

    // 取得所有磁貼按鈕
    const tileButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.textContent?.includes('發音') && !b.textContent?.includes('重設條件') && !b.textContent?.includes('確認送出拼裝'))

    expect(tileButtons.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(tileButtons[0])

    // 點擊提交
    const submitBtn = screen.getByText('確認送出拼裝')
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/回答正確！|答錯了/)).toBeInTheDocument()
    })
  })
})
