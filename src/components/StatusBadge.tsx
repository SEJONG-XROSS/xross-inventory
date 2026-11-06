import { STOCK_STATUS_META, type StockStatus } from '../config/stock'

export function StatusBadge({ status, className = '' }: { status: StockStatus; className?: string }) {
  const meta = STOCK_STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.badge} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  )
}
