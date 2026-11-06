import { STOCK_STATUS_META, STOCK_STATUS_ORDER } from '../config/stock'
import { SORT_LABELS, type SortKey, type StatusFilter, type ViewMode } from '../lib/filters'
import type { StockSummary } from '../lib/stock'
import { ChevronDownIcon, GridIcon, ListIcon, SearchIcon, XIcon } from './icons'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  status: StatusFilter
  onStatusChange: (s: StatusFilter) => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  summary: StockSummary
}

export function Toolbar(props: Props) {
  const { query, onQueryChange, status, onStatusChange, sort, onSortChange, view, onViewChange, summary } = props

  const filters: Array<{ key: StatusFilter; label: string; count: number; dot?: string }> = [
    { key: 'all', label: '전체', count: summary.total },
    ...STOCK_STATUS_ORDER.map((s) => ({
      key: s,
      label: STOCK_STATUS_META[s].label,
      count: summary[s],
      dot: STOCK_STATUS_META[s].dot,
    })),
  ]

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* 상태 필터 */}
      <div
        role="radiogroup"
        aria-label="재고 상태 필터"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 scrollbar-none"
      >
        {filters.map((f) => {
          const active = status === f.key
          return (
            <button
              key={f.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onStatusChange(f.key)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-[0.625rem] px-3.5 text-sm font-semibold transition-colors ${
                active ? 'bg-ink text-white' : 'bg-white text-muted ring-1 ring-line ring-inset hover:text-ink'
              }`}
            >
              {f.dot && <span className={`size-2 rounded-full ${f.dot}`} aria-hidden />}
              {f.label}
              <span className={`tnum text-xs ${active ? 'text-white/60' : 'text-haze'}`}>{f.count}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        {/* 검색 */}
        <label className="relative flex h-10 min-w-0 basis-full items-center sm:basis-0 sm:flex-1 lg:w-64 lg:flex-none lg:basis-auto">
          <span className="sr-only">상품명 검색</span>
          <SearchIcon className="pointer-events-none absolute left-3 text-haze" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="상품명 검색"
            className="h-full w-full rounded-[0.625rem] bg-white pr-9 pl-10 text-sm ring-1 ring-line outline-none ring-inset placeholder:text-haze focus:ring-2 focus:ring-signal [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="검색어 지우기"
              className="absolute right-2 grid size-6 place-items-center rounded-full text-haze hover:bg-paper hover:text-ink"
            >
              <XIcon width={14} height={14} />
            </button>
          )}
        </label>

        {/* 정렬 */}
        <label className="relative h-10 flex-1 sm:flex-none">
          <span className="sr-only">정렬</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="h-full w-full appearance-none rounded-[0.625rem] bg-white pr-8 pl-3 text-sm font-medium ring-1 ring-line outline-none ring-inset focus:ring-2 focus:ring-signal"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
          <ChevronDownIcon width={16} height={16} className="pointer-events-none absolute top-3 right-2.5 text-muted" />
        </label>

        {/* 보기 방식 */}
        <div
          role="radiogroup"
          aria-label="보기 방식"
          className="flex h-10 shrink-0 rounded-[0.625rem] bg-white p-1 ring-1 ring-line ring-inset"
        >
          {(
            [
              ['card', '카드로 보기', GridIcon],
              ['table', '표로 보기', ListIcon],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={view === key}
              aria-label={label}
              title={label}
              onClick={() => onViewChange(key)}
              className={`grid w-9 place-items-center rounded-md transition-colors ${
                view === key ? 'bg-ink text-white' : 'text-haze hover:text-ink'
              }`}
            >
              <Icon width={16} height={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
