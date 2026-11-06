import { formatDateTime } from '../lib/time'

export function Header({ storeName, now }: { storeName: string; now: Date }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-5 items-center md:h-6" role="img" aria-label="XROSS">
            <img src="/brand/nav-mark.png" alt="" className="h-full w-auto" />
            <img src="/brand/nav-wordmark.png" alt="" className="h-full w-auto" />
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" aria-hidden />
          <span className="hidden truncate text-sm font-medium text-muted sm:inline">재고 현황</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="hidden font-semibold text-ink sm:inline">{storeName}</span>
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
            <span className="tnum">{formatDateTime(now)}</span>
          </span>
        </div>
      </div>
    </header>
  )
}
