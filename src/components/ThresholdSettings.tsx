import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  DEFAULT_LOW_STOCK_THRESHOLD,
  MAX_LOW_STOCK_THRESHOLD,
  MIN_LOW_STOCK_THRESHOLD,
  STOCK_STATUS_META,
  STOCK_STATUS_ORDER,
  THRESHOLD_PRESETS,
} from '../config/stock'
import type { Product } from '../data/products'
import { summarize } from '../lib/stock'
import { MinusIcon, PlusIcon, SlidersIcon, XIcon } from './icons'

interface Props {
  threshold: number
  onChange: (value: number) => void
  products: Product[]
}

function parseDraft(draft: string): { value: number | null; error: string | null } {
  if (draft.trim() === '') return { value: null, error: '기준값을 입력해 주세요.' }
  const n = Number(draft)
  if (!Number.isInteger(n) || n < MIN_LOW_STOCK_THRESHOLD || n > MAX_LOW_STOCK_THRESHOLD) {
    return { value: null, error: `${MIN_LOW_STOCK_THRESHOLD}~${MAX_LOW_STOCK_THRESHOLD} 사이의 숫자로 입력해 주세요.` }
  }
  return { value: n, error: null }
}

export function ThresholdSettings({ threshold, onChange, products }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(String(threshold))
  const titleId = useId()
  const errorId = useId()

  const { value, error } = parseDraft(draft)
  const current = useMemo(() => summarize(products, threshold), [products, threshold])
  const preview = useMemo(() => (value === null ? null : summarize(products, value)), [products, value])

  const open = () => {
    setDraft(String(threshold))
    dialogRef.current?.showModal()
    requestAnimationFrame(() => inputRef.current?.select())
  }
  const close = () => dialogRef.current?.close()

  const step = (delta: number) => {
    const base = value ?? threshold
    const next = Math.min(MAX_LOW_STOCK_THRESHOLD, Math.max(MIN_LOW_STOCK_THRESHOLD, base + delta))
    setDraft(String(next))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value === null) return
    onChange(value)
    close()
  }

  const changed = value !== null && value !== threshold

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[0.625rem] border border-white/20 px-4 text-sm font-semibold text-white transition-colors hover:border-white/50"
      >
        <SlidersIcon width={16} height={16} />
        기준 설정
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="sheet m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-ink shadow-[0_40px_80px_-20px_rgba(8,18,41,0.45)] backdrop:bg-ink/60 backdrop:backdrop-blur-[2px] max-sm:mb-0 max-sm:w-full max-sm:max-w-full max-sm:rounded-b-none"
      >
        <form onSubmit={submit} noValidate>
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
            <div>
              <h2 id={titleId} className="text-lg font-bold tracking-[-0.02em]">
                재고 부족 기준 설정
              </h2>
              <p className="mt-1 text-sm text-muted">
                설정한 수량 <b className="font-semibold text-ink">미만</b>이면 ‘부족’으로 표시됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="-mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-full text-haze hover:bg-paper hover:text-ink"
            >
              <XIcon />
            </button>
          </div>

          <div className="px-5 py-5 md:px-6">
            {/* 스테퍼 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={(value ?? threshold) <= MIN_LOW_STOCK_THRESHOLD}
                aria-label="1 감소"
                className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <MinusIcon />
              </button>
              <label className="relative flex-1">
                <span className="sr-only">부족 기준 수량</span>
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                  onKeyDown={(e) => {
                    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
                    e.preventDefault()
                    step(e.key === 'ArrowUp' ? 1 : -1)
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  className={`tnum h-12 w-full rounded-xl bg-white pr-10 text-center text-2xl font-bold tracking-[-0.02em] ring-1 outline-none ring-inset focus:ring-2 ${
                    error ? 'ring-soldout focus:ring-soldout' : 'ring-line focus:ring-signal'
                  }`}
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted">개</span>
              </label>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={(value ?? threshold) >= MAX_LOW_STOCK_THRESHOLD}
                aria-label="1 증가"
                className="grid size-12 shrink-0 place-items-center rounded-xl bg-paper text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <PlusIcon />
              </button>
            </div>
            {error && (
              <p id={errorId} className="mt-2 text-xs font-medium text-soldout-ink">
                {error}
              </p>
            )}

            {/* 빠른 선택 */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {THRESHOLD_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDraft(String(n))}
                  aria-pressed={value === n}
                  className={`h-8 rounded-full px-3 text-[13px] font-semibold transition-colors ${
                    value === n ? 'bg-ink text-white' : 'bg-paper text-muted hover:text-ink'
                  }`}
                >
                  {n}개{n === DEFAULT_LOW_STOCK_THRESHOLD && ' (기본)'}
                </button>
              ))}
            </div>

            {/* 구간 미리보기 */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold text-muted">상태 구간</p>
              <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
                <span className="flex-1 bg-soldout" />
                <span className={`bg-low transition-[flex-grow] ${value === 1 ? 'grow-0' : 'grow-2'}`} />
                <span className="grow-3 bg-enough" />
              </div>
              <ul className="tnum mt-2 grid grid-cols-3 gap-2 text-xs">
                <li>
                  <span className="font-semibold text-soldout-ink">품절</span>
                  <span className="block text-muted">0개</span>
                </li>
                <li className="text-center">
                  <span className="font-semibold text-low-ink">부족</span>
                  <span className="block text-muted">
                    {value === null ? '—' : value <= 1 ? '해당 없음' : value === 2 ? '1개' : `1~${value - 1}개`}
                  </span>
                </li>
                <li className="text-right">
                  <span className="font-semibold text-enough-ink">충분</span>
                  <span className="block text-muted">{value === null ? '—' : `${value}개 이상`}</span>
                </li>
              </ul>
            </div>

            {/* 적용 결과 미리보기 */}
            <div className="mt-5 rounded-xl bg-paper p-3.5">
              <p className="text-xs font-semibold text-muted">
                {changed ? `${threshold}개 → ${value}개로 변경 시` : '현재 기준 적용 결과'}
              </p>
              <ul className="mt-2 grid grid-cols-3 gap-2">
                {STOCK_STATUS_ORDER.map((s) => {
                  const before = current[s]
                  const after = preview?.[s] ?? before
                  const diff = after - before
                  return (
                    <li key={s} className="rounded-lg bg-white px-3 py-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <span className={`size-1.5 rounded-full ${STOCK_STATUS_META[s].dot}`} aria-hidden />
                        {STOCK_STATUS_META[s].label}
                      </span>
                      <span className="tnum mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-bold tracking-[-0.02em]">{after}</span>
                        {changed && diff !== 0 && (
                          <span className={`text-xs font-semibold ${diff > 0 ? 'text-signal' : 'text-muted'}`}>
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4 md:px-6">
            <button
              type="button"
              onClick={() => setDraft(String(DEFAULT_LOW_STOCK_THRESHOLD))}
              disabled={value === DEFAULT_LOW_STOCK_THRESHOLD}
              className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              기본값({DEFAULT_LOW_STOCK_THRESHOLD}개)으로
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={close}
                className="h-11 rounded-[0.625rem] border border-line bg-white px-4 text-sm font-semibold transition-colors hover:border-ink"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={value === null}
                className="h-11 rounded-[0.625rem] bg-signal px-5 text-sm font-semibold text-white transition-colors hover:bg-signal-hover disabled:bg-haze"
              >
                저장
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  )
}
