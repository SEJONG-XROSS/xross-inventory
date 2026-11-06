/**
 * 재고 상태 기준값.
 *
 * - quantity >= 부족 기준값              → 충분
 * - 0 < quantity < 부족 기준값           → 부족
 * - quantity <= SOLD_OUT_QUANTITY        → 품절
 *
 * 부족 기준값은 화면의 "기준 설정"에서 변경할 수 있으며 브라우저(localStorage)에 저장된다.
 * 아래 값은 저장된 설정이 없을 때 쓰는 기본값과 입력 허용 범위다.
 */
export const DEFAULT_LOW_STOCK_THRESHOLD = 10
export const MIN_LOW_STOCK_THRESHOLD = 1
export const MAX_LOW_STOCK_THRESHOLD = 999
export const THRESHOLD_PRESETS = [5, 10, 15, 20]
export const SOLD_OUT_QUANTITY = 0

export const THRESHOLD_STORAGE_KEY = 'xross-inventory:low-stock-threshold'

export type StockStatus = 'enough' | 'low' | 'soldOut'

export const STOCK_STATUS_ORDER: StockStatus[] = ['enough', 'low', 'soldOut']

export const STOCK_STATUS_META: Record<
  StockStatus,
  {
    label: string
    /** 배지/텍스트 등 상태 색상 클래스 */
    badge: string
    dot: string
    text: string
  }
> = {
  enough: {
    label: '충분',
    badge: 'bg-enough-soft text-enough-ink ring-enough/25',
    dot: 'bg-enough',
    text: 'text-enough-ink',
  },
  low: {
    label: '부족',
    badge: 'bg-low-soft text-low-ink ring-low/30',
    dot: 'bg-low',
    text: 'text-low-ink',
  },
  soldOut: {
    label: '품절',
    badge: 'bg-soldout-soft text-soldout-ink ring-soldout/25',
    dot: 'bg-soldout',
    text: 'text-soldout-ink',
  },
}
