import { STOCK_STATUS_META } from '../config/stock'
import type { Product } from '../data/products'
import { getStockStatus } from '../lib/stock'
import { formatDateTime, formatRelative } from '../lib/time'
import { StatusBadge } from './StatusBadge'
import { ClockIcon } from './icons'

const imageBg = {
  enough: 'bg-paper',
  low: 'bg-low-soft/60',
  soldOut: 'bg-soldout-soft/60',
} as const

interface Props {
  product: Product
  now: Date
  lowThreshold: number
}

export function ProductCard({ product, now, lowThreshold }: Props) {
  const status = getStockStatus(product.quantity, lowThreshold)
  const meta = STOCK_STATUS_META[status]
  const soldOut = status === 'soldOut'

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(8,18,41,0.35)]">
      <div className={`relative aspect-[4/3] ${imageBg[status]}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 m-auto h-[78%] w-auto ${soldOut ? 'opacity-40 grayscale' : ''}`}
        />
        <StatusBadge status={status} className="absolute top-2.5 left-2.5 md:top-3 md:left-3" />
      </div>

      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <h3 className="truncate text-[15px] font-semibold tracking-[-0.02em] md:text-base">{product.name}</h3>

        <p className="mt-2 flex items-baseline gap-1">
          <span
            className={`tnum text-[28px] leading-none font-bold tracking-[-0.03em] md:text-[32px] ${
              status === 'enough' ? 'text-ink' : meta.text
            }`}
          >
            {product.quantity}
          </span>
          <span className="text-sm font-medium text-muted">개</span>
        </p>

        <p
          className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-xs text-muted"
          title={`마지막 업데이트 ${formatDateTime(product.updatedAt)}`}
        >
          <ClockIcon width={13} height={13} className="shrink-0 text-haze" />
          <time dateTime={product.updatedAt.toISOString()} className="tnum truncate">
            {formatRelative(product.updatedAt, now)}
            <span className="hidden text-haze sm:inline"> · {formatDateTime(product.updatedAt).slice(5)}</span>
          </time>
        </p>
      </div>
    </article>
  )
}
