'use client'

import * as React from 'react'
import {
  ScanLine,
  Upload,
  ImageIcon,
  Clock,
  Anchor,
  CheckSquare,
  Flame,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Trap = {
  id: number
  icon: typeof Clock
  label: string
  bias: string
  counter: string
}

const TRAPS: Trap[] = [
  {
    id: 1,
    icon: Clock,
    label: 'Countdown timer',
    bias: 'Artificial Scarcity',
    counter:
      'These timers almost always reset on reload. A genuinely good deal survives 24 hours — so sleep on it.',
  },
  {
    id: 2,
    icon: Anchor,
    label: 'Strike-through "original" price',
    bias: 'Anchoring Effect',
    counter:
      'The crossed-out price is an anchor engineered backward from the price they wanted. Decide your max before you ever see it.',
  },
  {
    id: 3,
    icon: CheckSquare,
    label: 'Pre-checked add-on',
    bias: 'Default Bias / Confirmshaming',
    counter:
      'Pre-ticked boxes ride on inertia, and guilt-tripping decline text ("No, I like overpaying") is confirmshaming. Untick everything by default.',
  },
  {
    id: 4,
    icon: Flame,
    label: '"Only 2 left · 38 viewing"',
    bias: 'Manufactured Scarcity + Social Proof',
    counter:
      'Unverifiable stock and viewer counts are usually fabricated scripts. Treat urgency as a red flag, never a reason.',
  },
  {
    id: 5,
    icon: EyeOff,
    label: 'Fees revealed at the last step',
    bias: 'Drip Pricing / Transaction Decoupling',
    counter:
      'Splitting the cost so each piece feels small hides the true total. Only ever judge the final, all-in number.',
  },
]

type Mode = 'idle' | 'example' | 'image'

export function TrapScanner() {
  const { logInfo, unlockBadge } = useNudge()
  const [mode, setMode] = React.useState<Mode>('idle')
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [revealed, setRevealed] = React.useState(0)
  const [scanning, setScanning] = React.useState(false)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [dragOver, setDragOver] = React.useState(false)

  const revealTimer = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const objectUrlRef = React.useRef<string | null>(null)
  const loggedRef = React.useRef(false)

  const clearTimers = () => {
    if (revealTimer.current) clearInterval(revealTimer.current)
    revealTimer.current = null
  }

  React.useEffect(() => {
    return () => {
      clearTimers()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const runScan = () => {
    clearTimers()
    setRevealed(0)
    setScanning(true)
    setSelected(null)
    loggedRef.current = false
    let count = 0
    revealTimer.current = setInterval(() => {
      count += 1
      setRevealed(count)
      if (count >= TRAPS.length) {
        clearTimers()
        setScanning(false)
        if (!loggedRef.current) {
          loggedRef.current = true
          logInfo({
            title: `Trap Scanner flagged ${TRAPS.length} checkout tricks`,
            bias: 'Pattern Recognition',
            detail:
              'Once you spot these in the wild, half the battle is already won.',
          })
          unlockBadge('trap-spotter')
        }
      }
    }, 700)
  }

  const loadExample = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setImageUrl(null)
    setMode('example')
    runScan()
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setImageUrl(url)
    setMode('image')
    runScan()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    clearTimers()
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setMode('idle')
    setImageUrl(null)
    setRevealed(0)
    setScanning(false)
    setSelected(null)
  }

  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Canvas */}
      <div className="space-y-4">
        {mode === 'idle' ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              'flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
              dragOver
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-zinc-700 bg-zinc-900/40',
            )}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-800 text-emerald-400">
              <ScanLine className="size-7" />
            </span>
            <h4 className="mt-4 font-serif text-lg font-semibold text-zinc-50">
              Scan a checkout for tricks
            </h4>
            <p className="mt-1 max-w-sm text-sm text-zinc-400">
              Drop in a screenshot, or load our example. The scanner flags each
              trick and tells you how to beat it.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={loadExample}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all"
              >
                <Sparkles className="size-4" /> Load E-commerce Example
              </button>
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
              >
                <Upload className="size-4" /> Upload screenshot
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            {/* Scan sweep line */}
            {scanning && (
              <div className="pointer-events-none absolute inset-x-0 z-20">
                <div className="nudge-scan-line absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_18px_4px_rgba(63,185,80,0.6)]" />
              </div>
            )}
            {scanning && (
              <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-zinc-950/80 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur">
                <ScanLine className="size-3.5 animate-pulse" /> Scanning…
              </div>
            )}

            {mode === 'example' ? (
              <MockCheckout
                revealed={revealed}
                selected={selected}
                onSelect={setSelected}
              />
            ) : (
              <div className="relative">
                {imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageUrl}
                    alt="Uploaded interface to scan"
                    className="w-full rounded-xl"
                  />
                )}
                {/* Illustrative pins over an arbitrary image */}
                {[
                  { top: '8%', left: '8%', t: TRAPS[0] },
                  { top: '34%', left: '60%', t: TRAPS[1] },
                  { top: '60%', left: '12%', t: TRAPS[2] },
                  { top: '78%', left: '64%', t: TRAPS[4] },
                ].map((p, i) =>
                  revealed > i ? (
                    <Pin
                      key={i}
                      top={p.top}
                      left={p.left}
                      n={p.t.id}
                      selected={selected === p.t.id}
                      onSelect={() => setSelected(p.t.id)}
                    />
                  ) : null,
                )}
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <AlertTriangle className="size-3" />
                  Pins are illustrative on uploaded images. Use the example for
                  pixel-accurate detection.
                </p>
              </div>
            )}
          </div>
        )}

        {mode !== 'idle' && (
          <div className="flex gap-3">
            <button
              onClick={runScan}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              <ScanLine className="size-4" /> Re-scan
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              <RotateCcw className="size-4" /> New scan
            </button>
          </div>
        )}
      </div>

      {/* Findings */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <ShieldCheck className="size-4 text-emerald-400" /> Detected patterns
          </h4>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300">
            {Math.min(revealed, TRAPS.length)}/{TRAPS.length}
          </span>
        </div>

        {mode === 'idle' ? (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Load a checkout to start.
          </p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {TRAPS.map((t, i) => {
              const shown = revealed > i
              const Icon = t.icon
              return (
                <li
                  key={t.id}
                  onMouseEnter={() => shown && setSelected(t.id)}
                  onMouseLeave={() => setSelected(null)}
                  className={cn(
                    'rounded-xl border p-3 transition-all',
                    !shown
                      ? 'border-zinc-800 bg-zinc-800/20 opacity-40'
                      : selected === t.id
                        ? 'border-emerald-500/50 bg-emerald-500/10 nudge-rise'
                        : 'border-zinc-800 bg-zinc-800/30 nudge-rise',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-rose-500/15 font-mono text-xs font-bold text-rose-400">
                      {t.id}
                    </span>
                    <Icon className="size-3.5 text-rose-400" />
                    <span className="text-sm font-semibold text-zinc-100">
                      {shown ? t.label : 'Scanning…'}
                    </span>
                  </div>
                  {shown && (
                    <>
                      <span className="mt-1.5 inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                        {t.bias}
                      </span>
                      <p className="mt-2 flex gap-1.5 text-[11px] leading-relaxed text-zinc-400">
                        <ShieldCheck className="mt-0.5 size-3 shrink-0 text-emerald-400" />
                        {t.counter}
                      </p>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Mock checkout (the built-in example)                              */
/* ------------------------------------------------------------------ */

function TrapZone({
  id,
  active,
  selected,
  onSelect,
  children,
}: {
  id: number
  active: boolean
  selected: boolean
  onSelect: (id: number) => void
  children: React.ReactNode
}) {
  return (
    <div
      onMouseEnter={() => active && onSelect(id)}
      className={cn(
        'relative rounded-lg transition-all',
        active &&
          (selected
            ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-900'
            : 'ring-2 ring-rose-500/60'),
      )}
    >
      {active && (
        <span
          className={cn(
            'absolute -left-2 -top-2 z-10 flex size-5 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white nudge-rise',
            selected ? 'bg-emerald-500' : 'bg-rose-500',
          )}
        >
          {id}
        </span>
      )}
      {children}
    </div>
  )
}

function MockCheckout({
  revealed,
  selected,
  onSelect,
}: {
  revealed: number
  selected: number | null
  onSelect: (id: number) => void
}) {
  return (
    <div className="rounded-xl bg-zinc-100 p-4 text-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Checkout
          </p>
          <h5 className="text-base font-bold">AuraPods Pro™</h5>
        </div>
        <TrapZone id={1} active={revealed >= 1} selected={selected === 1} onSelect={onSelect}>
          <div className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-600">
            <Clock className="size-3.5" /> 04:59 left
          </div>
        </TrapZone>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-extrabold text-zinc-900">$49</span>
        <TrapZone id={2} active={revealed >= 2} selected={selected === 2} onSelect={onSelect}>
          <span className="text-sm text-zinc-400 line-through">$129</span>
        </TrapZone>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
          -62%
        </span>
      </div>

      {/* Scarcity */}
      <TrapZone id={4} active={revealed >= 4} selected={selected === 4} onSelect={onSelect}>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
          <Flame className="size-3.5" /> Only 2 left · 38 people viewing this now
        </p>
      </TrapZone>

      {/* Add-on */}
      <TrapZone id={3} active={revealed >= 3} selected={selected === 3} onSelect={onSelect}>
        <div className="mt-3 rounded-lg border border-zinc-300 bg-white p-2.5">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-800">
            <span className="flex size-4 items-center justify-center rounded bg-emerald-500 text-white">
              <CheckSquare className="size-3" />
            </span>
            Add 2-Year Protection Plan (+$19.99)
          </label>
          <p className="mt-1 pl-6 text-[10px] text-zinc-400">
            No thanks, I’ll risk damaging my new earbuds.
          </p>
        </div>
      </TrapZone>

      {/* Summary */}
      <TrapZone id={5} active={revealed >= 5} selected={selected === 5} onSelect={onSelect}>
        <div className="mt-3 space-y-1 rounded-lg bg-zinc-50 p-2.5 text-xs">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span>$68.99</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Shipping &amp; handling</span>
            <span>$12.90</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Service fee</span>
            <span>$3.50</span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-1 font-bold text-zinc-900">
            <span>Total</span>
            <span>$85.39</span>
          </div>
        </div>
      </TrapZone>

      <button className="mt-3 w-full rounded-lg bg-rose-500 py-2 text-sm font-bold text-white">
        Complete Purchase
      </button>
    </div>
  )
}

function Pin({
  top,
  left,
  n,
  selected,
  onSelect,
}: {
  top: string
  left: string
  n: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onMouseEnter={onSelect}
      style={{ top, left }}
      className={cn(
        'absolute z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-xs font-bold text-white shadow-lg nudge-rise',
        selected ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-rose-500 nudge-pulse-danger',
      )}
    >
      {n}
    </button>
  )
}
