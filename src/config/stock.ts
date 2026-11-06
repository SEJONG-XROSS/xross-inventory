/**
 * 재고 상태 기준값.
 * 기준을 바꾸려면 이 파일의 값만 수정하면 된다.
 *
 * - quantity >= LOW_STOCK_THRESHOLD      → 충분
 * - 0 < quantity < LOW_STOCK_THRESHOLD   → 부족
 * - quantity <= SOLD_OUT_QUANTITY        → 품절
 */
export const LOW_STOCK_THRESHOLD = 10
export const SOLD_OUT_QUANTITY = 0

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
