import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { ProductTable } from './components/ProductTable'
import { SummaryCards } from './components/SummaryCards'
import { Toolbar } from './components/Toolbar'
import { BoxIcon } from './components/icons'
import { LOW_STOCK_THRESHOLD, STOCK_STATUS_META } from './config/stock'
import { STORE_NAME, products } from './data/products'
import { SORT_LABELS, type SortKey, type StatusFilter, type ViewMode } from './lib/filters'
import { getStockStatus, summarize } from './lib/stock'

/** 상대 시간("n분 전")이 갱신되도록 1분마다 현재 시각을 갱신 */
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

const sorters: Record<SortKey, (a: (typeof products)[number], b: (typeof products)[number]) => number> = {
  quantityAsc: (a, b) => a.quantity - b.quantity || a.name.localeCompare(b.name, 'ko'),
  quantityDesc: (a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, 'ko'),
  recent: (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  name: (a, b) => a.name.localeCompare(b.name, 'ko'),
}

export default function App() {
  const now = useNow()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('quantityAsc')
  const [view, setView] = useState<ViewMode>('card')

  const summary = useMemo(() => summarize(products), [])

  const visible = useMemo(() => {
    const q = query.trim().replace(/\s+/g, '').toLowerCase()
    return products
      .filter((p) => status === 'all' || getStockStatus(p.quantity) === status)
      .filter((p) => !q || p.name.replace(/\s+/g, '').toLowerCase().includes(q))
      .sort(sorters[sort])
  }, [query, status, sort])

  const latestUpdate = useMemo(
    () => new Date(Math.max(...products.map((p) => p.updatedAt.getTime()))),
    [],
  )

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
  }

  return (
    <div className="min-h-svh">
      <Header storeName={STORE_NAME} now={now} />

      {/* 요약 */}
      <section className="relative overflow-hidden bg-ink pt-8 pb-10 text-white md:pt-12 md:pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-signal/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 left-[-10%] size-[420px] rounded-full bg-violet/20 blur-[120px]"
        />
        <div className="wrap relative">
          <p className="text-sm font-medium text-sky sm:hidden">{STORE_NAME}</p>
          <h1 className="mt-1 text-[1.75rem] leading-tight font-bold tracking-[-0.03em] sm:mt-0 md:text-[2.25rem]">
            아이스크림 재고 현황
          </h1>
          <p className="mt-2 text-sm text-haze md:text-[15px]">
            상품별 재고를 한눈에 확인하세요. 재고가 {LOW_STOCK_THRESHOLD}개 미만이면{' '}
            <span className="font-semibold text-low">{STOCK_STATUS_META.low.label}</span>, 0개이면{' '}
            <span className="font-semibold text-soldout">{STOCK_STATUS_META.soldOut.label}</span>로 표시됩니다.
          </p>
          <div className="mt-7 md:mt-9">
            <SummaryCards summary={summary} active={status} onSelect={setStatus} />
          </div>
        </div>
      </section>

      {/* 목록 */}
      <main className="wrap py-6 md:py-10">
        <Toolbar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          summary={summary}
        />

        <p className="mt-5 mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-muted">
          <span>
            <span className="tnum font-semibold text-ink">{visible.length}</span>개 상품 · {SORT_LABELS[sort]}
          </span>
          <span className="tnum">
            최근 수량 업데이트 {latestUpdate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </p>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-paper text-haze">
              <BoxIcon width={22} height={22} />
            </span>
            <p className="mt-4 font-semibold">조건에 맞는 상품이 없습니다</p>
            <p className="mt-1 text-sm text-muted">
              {query ? `‘${query}’ 검색 결과가 없어요. ` : ''}필터를 변경하거나 초기화해 보세요.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex h-10 items-center rounded-[0.625rem] bg-signal px-4 text-sm font-semibold text-white transition-colors hover:bg-signal-hover"
            >
              필터 초기화
            </button>
          </div>
        ) : view === 'card' ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {visible.map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} now={now} />
              </li>
            ))}
          </ul>
        ) : (
          <ProductTable products={visible} now={now} />
        )}
      </main>

      <footer className="border-t border-line">
        <div className="wrap py-6 text-xs text-haze">
          <span>© XROSS · AI 기반 무인매장 관제 솔루션</span>
        </div>
      </footer>
    </div>
  )
}
