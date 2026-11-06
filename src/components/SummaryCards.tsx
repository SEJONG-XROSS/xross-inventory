import { STOCK_STATUS_META, STOCK_STATUS_ORDER } from '../config/stock'
import type { StockSummary } from '../lib/stock'
import type { StatusFilter } from '../lib/filters'

interface Props {
  summary: StockSummary
  active: StatusFilter
  onSelect: (filter: StatusFilter) => void
}

export function SummaryCards({ summary, active, onSelect }: Props) {
  const tiles: Array<{ key: StatusFilter; label: string; value: number; dot?: string; hint: string }> = [
    { key: 'all', label: '전체 상품', value: summary.total, hint: '등록된 상품' },
    ...STOCK_STATUS_ORDER.map((s) => ({
      key: s,
      label: `재고 ${STOCK_STATUS_META[s].label}`,
      value: summary[s],
      dot: STOCK_STATUS_META[s].dot,
      hint: s === 'soldOut' ? '즉시 보충 필요' : s === 'low' ? '보충 권장' : '정상 판매 중',
    })),
  ]

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {tiles.map((t) => {
        const isActive = active === t.key
        return (
          <li key={t.key}>
            <button
              type="button"
              onClick={() => onSelect(t.key)}
              aria-pressed={isActive}
              className={`group w-full rounded-2xl border p-4 text-left transition-colors md:p-5 ${
                isActive
                  ? 'border-signal bg-signal/15'
                  : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
              }`}
            >
              <span className="flex items-center gap-2 text-[13px] font-medium text-haze md:text-sm">
                {t.dot ? (
                  <span className={`size-2 rounded-full ${t.dot}`} aria-hidden />
                ) : (
                  <img src="/brand/mark.png" alt="" className="size-3.5" />
                )}
                {t.label}
              </span>
              <span className="mt-3 flex items-baseline gap-1 text-white">
                <span className="tnum text-3xl font-bold tracking-[-0.03em] md:text-4xl">{t.value}</span>
                <span className="text-sm text-haze">개</span>
              </span>
              <span className="mt-1 block text-xs text-haze/80">{t.hint}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
