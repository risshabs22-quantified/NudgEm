'use client'

import * as React from 'react'
import {
  Flame,
  Clock,
  Users,
  ShoppingCart,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  TrendingDown,
  Anchor,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

const ITEM = {
  name: 'Hyper-Hype Air Sneakers',
  edition: 'Limited "Neon Drop" Colorway',
  realPrice: 95,
  anchorPrice: 250,
}

const CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Miami',
  'Seattle',
  'Austin',
  'Toronto',
  'London',
]

type Triggers = {
  timer: boolean
  stock: boolean
  social: boolean
}

type Outcome =
  | { type: 'trapped'; bias: string; title: string; detail: string }
  | { type: 'resisted'; title: string; detail: string }
  | null

export function ImpulseSimulator() {
  const { fallForTrap, resistTrap, unlockBadge } = useNudge()

  const [triggers, setTriggers] = React.useState<Triggers>({
    timer: true,
    stock: true,
    social: true,
  })
  const [seconds, setSeconds] = React.useState(180)
  const [stock, setStock] = React.useState(2)
  const [social, setSocial] = React.useState<{ city: string; key: number } | null>(
    null,
  )
  const [outcome, setOutcome] = React.useState<Outcome>(null)
  const [shake, setShake] = React.useState(false)

  const activeCount = Number(triggers.timer) + Number(triggers.stock) + Number(triggers.social)

  // Countdown timer
  React.useEffect(() => {
    if (!triggers.timer) return
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 180 : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [triggers.timer])

  // Fake "someone just bought this" social-proof popups
  React.useEffect(() => {
    if (!triggers.social) {
      setSocial(null)
      return
    }
    let timeout: ReturnType<typeof setTimeout>
    const loop = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      setSocial({ city, key: Date.now() })
      timeout = setTimeout(() => {
        setSocial(null)
        timeout = setTimeout(loop, 1800 + Math.random() * 2200)
      }, 3200)
    }
    timeout = setTimeout(loop, 1200)
    return () => clearTimeout(timeout)
  }, [triggers.social])

  // "Stock" jitter to feel frantic
  React.useEffect(() => {
    if (!triggers.stock) return
    const id = setInterval(() => {
      setStock((s) => (s <= 1 ? 3 : s - 1))
    }, 7000)
    return () => clearInterval(id)
  }, [triggers.stock])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  const handleBuy = () => {
    if (activeCount > 0) {
      // The user fell for the manufactured urgency.
      const cost = ITEM.realPrice
      const rationalityHit = 6 + activeCount * 4
      const biasName = triggers.timer || triggers.stock ? 'Scarcity Mindset' : 'Anchoring Effect'

      const reasons: string[] = []
      if (triggers.timer) reasons.push('a fake countdown timer')
      if (triggers.stock) reasons.push('a "low stock" scare')
      if (triggers.social) reasons.push('a fake "someone just bought this" popup')

      setShake(true)
      setTimeout(() => setShake(false), 500)

      setOutcome({
        type: 'trapped',
        bias: biasName,
        title: `Yeah... you just dropped $${cost} on impulse.`,
        detail: `${reasons.length} trick${
          reasons.length > 1 ? 's were' : ' was'
        } running on you: ${reasons.join(
          ', ',
        )}. And that "$${ITEM.anchorPrice} → $${ITEM.realPrice}" tag? The $${ITEM.anchorPrice} only exists to make $${ITEM.realPrice} feel like a W. The timer resets on reload btw. None of it was real.`,
      })
      fallForTrap({
        cost,
        rationalityHit,
        title: `Folded under pressure. Bought the sneakers.`,
        bias: biasName,
        detail: `Caved to ${reasons.length} live trick(s). -$${cost}.`,
      })
    } else {
      // No triggers active — a calm, rational purchase.
      setOutcome({
        type: 'resisted',
        title: 'Bought it with zero pressure. That’s fine.',
        detail:
          'No timers, no fake scarcity, no popups — just you deciding you want it. Feel how boring and calm that was? That calm is exactly what every store deletes on purpose.',
      })
      resistTrap({
        rationalityGain: 3,
        title: 'Bought it, but with a clear head',
        bias: 'Mindful Spending',
        detail: 'Made the call with none of the tricks running.',
      })
    }
  }

  const handleSkip = () => {
    setOutcome({
      type: 'resisted',
      title: 'You closed the tab. Respect.',
      detail:
        activeCount > 0
          ? `You ignored ${activeCount} trick${
              activeCount > 1 ? 's' : ''
            } screaming at you. A real deal is still a deal tomorrow — the panic was the whole point.`
          : 'No pressure on, and you still passed. If you don’t actually want it, you don’t need it. Easy.',
    })
    resistTrap({
      rationalityGain: 4,
      title: `Walked away from the sneakers`,
      bias: 'Scarcity Mindset',
      detail: `Ignored ${activeCount} live trick(s). Kept your $${ITEM.realPrice}.`,
    })
    if (activeCount > 0) unlockBadge('scarcity-skeptic')
  }

  const reset = () => {
    setOutcome(null)
    setSeconds(180)
    setStock(2)
  }

  const ToggleChip = ({
    on,
    onClick,
    icon: Icon,
    label,
  }: {
    on: boolean
    onClick: () => void
    icon: typeof Flame
    label: string
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
        on
          ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
          : 'border-zinc-700 bg-zinc-800/40 text-zinc-500 hover:text-zinc-300',
      )}
    >
      <Icon className="size-3.5" />
      {label}
      <span
        className={cn(
          'ml-1 size-1.5 rounded-full',
          on ? 'bg-rose-400 nudge-flash' : 'bg-zinc-600',
        )}
      />
    </button>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Product card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1',
          shake && 'nudge-shake',
        )}
      >
        {/* Social proof popup */}
        {social && (
          <div
            key={social.key}
            className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-900/95 px-3 py-2 shadow-xl shadow-black/40 nudge-rise"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <Users className="size-3.5" />
            </span>
            <div className="text-xs">
              <p className="font-medium text-zinc-100">
                Someone in {social.city} just bought this!
              </p>
              <p className="text-[10px] text-zinc-500">a few seconds ago</p>
            </div>
          </div>
        )}

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
          {/* Stylized sneaker visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[7rem] leading-none drop-shadow-[0_8px_24px_rgba(63,185,80,0.35)]">
              👟
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(63,185,80,0.15),transparent_55%)]" />

          {/* Stock badge */}
          {triggers.stock && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-300 nudge-pulse-danger">
              <Flame className="size-3.5 nudge-flash" />
              Only {stock} left in stock!
            </div>
          )}

          {/* Timer */}
          {triggers.timer && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-zinc-950/80 px-3 py-1.5 font-mono text-xs font-bold text-amber-300 backdrop-blur">
              <Clock className="size-3.5 animate-spin [animation-duration:3s]" />
              {mins}:{secs.toString().padStart(2, '0')} left
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
            {ITEM.edition}
          </p>
          <h3 className="mt-1 font-serif text-xl font-semibold text-zinc-50">
            {ITEM.name}
          </h3>

          <div className="mt-3 flex items-end gap-2">
            <span className="font-mono text-3xl font-bold text-zinc-50">
              ${ITEM.realPrice}
            </span>
            <span className="mb-1 font-mono text-sm text-zinc-500 line-through">
              ${ITEM.anchorPrice}
            </span>
            <span className="mb-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              -62%
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
            <Anchor className="size-3" /> That $250 isn’t real. It’s bait to make $95 look cheap.
          </p>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleBuy}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-95"
            >
              <ShoppingCart className="size-4 transition-transform group-hover:scale-110" />
              Buy Now
            </button>
            <button
              onClick={handleSkip}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
            >
              <X className="size-4" />
              Skip It
            </button>
          </div>
        </div>
      </div>

      {/* Control + analysis panel */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <Sparkles className="size-4 text-emerald-400" />
              The Dirty Tricks
            </h4>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                activeCount > 0
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-emerald-500/15 text-emerald-300',
              )}
            >
              {activeCount} active
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Flip the tricks on and off, then try to buy. Notice how different it
            feels when they’re all yelling at you.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ToggleChip
              on={triggers.timer}
              onClick={() => setTriggers((t) => ({ ...t, timer: !t.timer }))}
              icon={Clock}
              label="Countdown Timer"
            />
            <ToggleChip
              on={triggers.stock}
              onClick={() => setTriggers((t) => ({ ...t, stock: !t.stock }))}
              icon={Flame}
              label="Low Stock Badge"
            />
            <ToggleChip
              on={triggers.social}
              onClick={() => setTriggers((t) => ({ ...t, social: !t.social }))}
              icon={Users}
              label="Social Proof Popup"
            />
          </div>
        </div>

        {/* Live alert box */}
        <div
          className={cn(
            'flex-1 rounded-2xl border p-4 transition-colors',
            outcome?.type === 'trapped'
              ? 'border-rose-500/40 bg-rose-500/5'
              : outcome?.type === 'resisted'
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-zinc-800 bg-zinc-900/40',
          )}
        >
          {!outcome && (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="size-8 text-zinc-700" />
              <p className="mt-3 text-sm font-medium text-zinc-400">
                Pick something and find out
              </p>
              <p className="mt-1 max-w-xs text-xs text-zinc-600">
                Buy or skip — either way your score and budget up top will move.
                No pressure. (Okay, lots of pressure.)
              </p>
            </div>
          )}

          {outcome?.type === 'trapped' && (
            <div className="nudge-rise">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
                  <TrendingDown className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                    {outcome.bias}
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">
                    {outcome.title}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {outcome.detail}
              </p>
              <button
                onClick={reset}
                className="mt-4 flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                <RotateCcw className="size-3.5" /> Try again
              </button>
            </div>
          )}

          {outcome?.type === 'resisted' && (
            <div className="nudge-rise">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    Smart Move
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">
                    {outcome.title}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {outcome.detail}
              </p>
              <button
                onClick={reset}
                className="mt-4 flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                <RotateCcw className="size-3.5" /> Run it again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
