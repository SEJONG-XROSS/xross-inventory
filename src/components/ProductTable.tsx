import { STOCK_STATUS_META } from '../config/stock'
import type { Product } from '../data/products'
import { getStockStatus } from '../lib/stock'
import { formatDateTime, formatRelative } from '../lib/time'
import { StatusBadge } from './StatusBadge'

interface Props {
  products: Product[]
  now: Date
  lowThreshold: number
}

export function ProductTable({ products, now, lowThreshold }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="hidden border-b border-line bg-paper/60 text-xs font-semibold text-muted md:table-header-group">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">상품</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">재고 수량</th>
            <th scope="col" className="px-5 py-3 font-semibold">상태</th>
            <th scope="col" className="px-5 py-3 font-semibold">마지막 업데이트</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((p) => {
            const status = getStockStatus(p.quantity, lowThreshold)
            const meta = STOCK_STATUS_META[status]
            const soldOut = status === 'soldOut'
            return (
              // 모바일: 한 줄 리스트 / 데스크톱: 표
              <tr key={p.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-4 py-3 md:table-row md:p-0">
                <td className="row-span-2 md:px-5 md:py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper">
                      <img
                        src={p.imageUrl}
                        alt=""
                        className={`size-10 ${soldOut ? 'opacity-40 grayscale' : ''}`}
                      />
                    </span>
                    <span className="hidden font-semibold md:inline">{p.name}</span>
                  </div>
                </td>
                <td className="font-semibold md:hidden">{p.name}</td>
                <td className="row-span-2 text-right md:px-5 md:py-3">
                  <span className={`tnum text-xl font-bold tracking-[-0.02em] ${status === 'enough' ? 'text-ink' : meta.text}`}>
                    {p.quantity}
                  </span>
                  <span className="ml-0.5 text-xs text-muted">개</span>
                  <div className="mt-1 md:hidden">
                    <StatusBadge status={status} />
                  </div>
                </td>
                <td className="hidden md:table-cell md:px-5 md:py-3">
                  <StatusBadge status={status} />
                </td>
                <td className="text-xs text-muted md:px-5 md:py-3 md:text-sm">
                  <time dateTime={p.updatedAt.toISOString()} className="tnum">
                    <span className="md:hidden">{formatRelative(p.updatedAt, now)} 업데이트</span>
                    <span className="hidden md:inline">
                      {formatDateTime(p.updatedAt)}
                      <span className="ml-1.5 text-haze">({formatRelative(p.updatedAt, now)})</span>
                    </span>
                  </time>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
