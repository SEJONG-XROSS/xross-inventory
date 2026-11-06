import type { StockStatus } from '../config/stock'

export type StatusFilter = 'all' | StockStatus
export type SortKey = 'quantityAsc' | 'quantityDesc' | 'name' | 'recent'
export type ViewMode = 'card' | 'table'

export const SORT_LABELS: Record<SortKey, string> = {
  quantityAsc: '재고 적은 순',
  quantityDesc: '재고 많은 순',
  recent: '최근 업데이트 순',
  name: '이름 순',
}
