import { formatDateTime } from '../lib/time'

export function Header({ storeName, now }: { storeName: string; now: Date }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/brand/logo-white.png" alt="XROSS" className="h-5 w-auto md:h-6" />
          <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
          <span className="hidden truncate text-sm font-medium text-white/75 sm:inline">재고 현황</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="hidden font-semibold text-white sm:inline">{storeName}</span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs text-haze">
            <span className="size-1.5 rounded-full bg-sky" aria-hidden />
            <span className="tnum">{formatDateTime(now)}</span>
          </span>
        </div>
      </div>
    </header>
  )
}
