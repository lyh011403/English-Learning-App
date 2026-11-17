import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('T6: 核心學習介面整合', () => {
  it('應正確載入 LexiClip 並初始化種子詞庫', async () => {
    render(<App />)
    expect(screen.getByText('LexiClip')).toBeInTheDocument()

    // 等待資料庫載入完成並顯示背單字主卡片內容
    await waitFor(
      () => {
        expect(screen.getByText(/詞根結構/i)).toBeInTheDocument()
      },
      { timeout: 8000 }
    )
  })

  it('點擊底部導航「詞根樹」應切換至詞根字源家族視圖', async () => {
    render(<App />)
    const rootsTab = screen.getByRole('button', { name: /詞根樹/i })
    fireEvent.click(rootsTab)

    await waitFor(() => {
      expect(screen.getByText(/詞根字源家族/i)).toBeInTheDocument()
    })
  })

  it('點擊底部導航「進度」應切換至 FSRS 進度統計視圖', async () => {
    render(<App />)
    const statsTab = screen.getByRole('button', { name: /進度/i })
    fireEvent.click(statsTab)

    await waitFor(() => {
      expect(screen.getByText(/今日待複習/i)).toBeInTheDocument()
      expect(screen.getByText(/記憶狀態分佈/i)).toBeInTheDocument()
    })
  })

  it('全域搜尋列應支援即時輸入檢索單字', async () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText(/搜尋單字/i)
    fireEvent.change(searchInput, { target: { value: 'sync' } })

    await waitFor(() => {
      expect(screen.getByText(/本機單字庫/i)).toBeInTheDocument()
      expect(screen.getByText('synchronize')).toBeInTheDocument()
    })
  })
})
