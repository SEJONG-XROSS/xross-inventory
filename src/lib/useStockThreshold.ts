import { useCallback, useState } from 'react'
import {
  DEFAULT_LOW_STOCK_THRESHOLD,
  MAX_LOW_STOCK_THRESHOLD,
  MIN_LOW_STOCK_THRESHOLD,
  THRESHOLD_STORAGE_KEY,
} from '../config/stock'

export function clampThreshold(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_LOW_STOCK_THRESHOLD
  return Math.min(MAX_LOW_STOCK_THRESHOLD, Math.max(MIN_LOW_STOCK_THRESHOLD, Math.round(value)))
}

function readStored(): number {
  try {
    const raw = localStorage.getItem(THRESHOLD_STORAGE_KEY)
    return raw === null ? DEFAULT_LOW_STOCK_THRESHOLD : clampThreshold(Number(raw))
  } catch {
    return DEFAULT_LOW_STOCK_THRESHOLD
  }
}

/** 재고 부족 기준값. 브라우저(localStorage)에 저장되어 새로고침 후에도 유지된다. */
export function useStockThreshold() {
  const [threshold, setThresholdState] = useState(readStored)

  const setThreshold = useCallback((value: number) => {
    const next = clampThreshold(value)
    setThresholdState(next)
    try {
      if (next === DEFAULT_LOW_STOCK_THRESHOLD) localStorage.removeItem(THRESHOLD_STORAGE_KEY)
      else localStorage.setItem(THRESHOLD_STORAGE_KEY, String(next))
    } catch {
      // 저장 불가(시크릿 모드 등) 시에도 현재 세션에는 반영
    }
  }, [])

  return [threshold, setThreshold] as const
}
