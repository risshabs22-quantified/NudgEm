'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import {
  Tv,
  Gamepad2,
  ShoppingBag,
  Coffee,
  ToggleRight,
  TrendingUp,
  AlertCircle,
  PiggyBank,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Sub = {
  key: string
  label: string
  icon: typeof Tv
  value: number
  max: number
}

const INITIAL: Sub[] = [
  { key: 'streaming', label: 'Streaming services', icon: Tv, value: 16, max: 60 },
  { key: 'gaming', label: 'Gaming skins / battle passes', icon: Gamepad2, value: 10, max: 60 },
  { key: 'tiktok', label: 'TikTok Shop impulse buys', icon: ShoppingBag, value: 12, max: 60 },
  { key: 'coffee', label: 'App-ordered coffee', icon: Coffee, value: 9, max: 60 },
]

const ANNUAL_RETURN = 0.07
const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 })

// Future value of a monthly contribution stream at ANNUAL_RETURN, compounded monthly.
function investedValue(monthly: number, years: number) {
  const r = ANNUAL_RETURN / 12
  const k = years * 12
  if (r === 0) return monthly * k
  return monthly * ((Math.pow(1 + r, k) - 1) / r)
}

export function SubscriptionCalculator() {
  const { unlockBadge } = useNudge()
  const [subs, setSubs] = React.useState<Sub[]>(INITIAL)
  const [autoRenew, setAutoRenew] = React.useState(true)

  const monthlyRaw = subs.reduce((sum, s) => sum + s.value, 0)
  // Default Bias: with auto-renew ON you forget and pay 100%.
  // With it OFF you actively review and cancel, paying ~35%.
  const forgottenFactor = autoRenew ? 1 : 0.35
  const effectiveMonthly = monthlyRaw * forgottenFactor

  const horizons = [1, 5, 10]
  const data = horizons.map((y) => ({
    year: `${y}yr`,
    spent: Math.round(effectiveMonthly * 12 * y),
    invested: Math.round(investedValue(effectiveMonthly, y)),
  }))

  const tenYearSpent = data[2].spent
  const tenYearInvested = data[2].invested
  const opportunityCost = tenYearInvested

  const setValue = (key: string, value: number) =>
    setSubs((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)))

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Controls */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h4 className="text-sm font-semibold text-zinc-100">
          The little stuff you forget about
        </h4>
        <p className="mt-1 text-xs text-zinc-500">
          Drag the sliders to match your actual life. These tiny "I won’t even
          notice it" charges add up way faster than you think.
        </p>

        <div className="mt-5 space-y-5">
          {subs.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400">
                      <Icon className="size-4" />
                    </span>
                    {s.label}
                  </label>
                  <span className="font-mono text-sm font-semibold text-zinc-100">
                    ${s.value}
                    <span className="text-xs text-zinc-500">/mo</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={s.max}
                  step={1}
                  value={s.value}
                  onChange={(e) => setValue(s.key, Number(e.target.value))}
                  className="nudge-range mt-2 w-full"
                  aria-label={s.label}
                />
              </div>
            )
          })}
        </div>

        {/* Auto-renew toggle */}
        <button
          onClick={() =>
            setAutoRenew((v) => {
              if (v) unlockBadge('default-bias-defeater') // turning it OFF
              return !v
            })
          }
          className={cn(
            'mt-6 flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all',
            autoRenew
              ? 'border-amber-500/40 bg-amber-500/10'
              : 'border-emerald-500/40 bg-emerald-500/10',
          )}
        >
          <span className="flex items-center gap-3">
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                autoRenew
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400',
              )}
            >
              <ToggleRight className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-100">
                Auto-Renewal {autoRenew ? 'ON' : 'OFF'}
              </span>
              <span className="block text-[11px] text-zinc-500">
                {autoRenew
                  ? 'Default Bias mode: you forget, you pay full price, every month, forever.'
                  : 'You actually check and cancel stuff — so you only pay ~35%.'}
              </span>
            </span>
          </span>
          <span
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              autoRenew ? 'bg-amber-500' : 'bg-zinc-700',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-5 rounded-full bg-white transition-all',
                autoRenew ? 'left-[22px]' : 'left-0.5',
              )}
            />
          </span>
        </button>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-800/40 px-4 py-3">
          <span className="text-xs text-zinc-400">What actually leaves your wallet</span>
          <span className="font-mono text-lg font-bold text-zinc-50">
            ${fmt(effectiveMonthly)}
            <span className="text-xs font-normal text-zinc-500">/mo</span>
          </span>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-100">
              What "forgetting to cancel" actually costs
            </h4>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-rose-300">
                <span className="size-2.5 rounded-sm bg-rose-500" /> Spent
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="size-2.5 rounded-sm bg-emerald-500" /> If invested
              </span>
            </div>
          </div>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={6} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(92,70,58,0.25)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#ab8f7c', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8a6f5e', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(58,44,36,0.25)' }}
                  contentStyle={{
                    background: '#1d1512',
                    border: '1px solid #3a2c24',
                    borderRadius: 12,
                    color: '#f2e7d9',
                    fontSize: 12,
                  }}
                  formatter={(value: number, name) => [
                    `$${fmt(value)}`,
                    name === 'spent' ? 'Money spent' : 'If invested @7%',
                  ]}
                />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]} maxBarSize={42}>
                  {data.map((_, i) => (
                    <Cell key={i} fill="#e57a66" />
                  ))}
                </Bar>
                <Bar dataKey="invested" radius={[6, 6, 0, 0]} maxBarSize={42}>
                  {data.map((_, i) => (
                    <Cell key={i} fill="#93c2a1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertCircle className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                10-Year Spend
              </span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-zinc-50">
              ${fmt(tenYearSpent)}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Gone before you notice.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <PiggyBank className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Opportunity Cost
              </span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400 text-glow-emerald">
              ${fmt(opportunityCost)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500">
              <TrendingUp className="size-3" />
              What it'd be at 7%/yr if you kept it.
            </p>
          </div>
        </div>

        <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-xs leading-relaxed text-zinc-400">
          <span className="font-semibold text-amber-300">Default Bias</span> is
          why auto-renew is always pre-checked. Turning it off means you have to
          decide every month — and that one extra step is the gap between the red
          bar and the green one.
        </p>
      </div>
    </div>
  )
}
