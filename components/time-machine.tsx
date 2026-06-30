'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts'
import { Coffee, Hourglass, TrendingUp, Sparkles, Coins } from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

const RATE = 0.08
const START_AGE = 18
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

// Future value of investing `annual` every year for `years` at RATE.
function fv(annual: number, years: number) {
  if (years <= 0) return 0
  return annual * ((Math.pow(1 + RATE, years) - 1) / RATE)
}

const BENCHMARKS = [
  { at: 1500, label: 'a great weekend getaway 🏖️' },
  { at: 6000, label: 'a serious emergency fund 🛟' },
  { at: 15000, label: 'a solid used car 🚗' },
  { at: 45000, label: 'a house down payment 🏡' },
  { at: 120000, label: "a child's full college fund 🎓" },
  { at: 300000, label: 'early-retirement freedom 🌴' },
]

function benchmarkFor(value: number) {
  let best = BENCHMARKS[0]
  for (const b of BENCHMARKS) if (value >= b.at) best = b
  return value < BENCHMARKS[0].at ? null : best
}

export function TimeMachine() {
  const { logInfo, unlockBadge } = useNudge()
  const [daily, setDaily] = React.useState(7)
  const [age, setAge] = React.useState(40)
  const awarded = React.useRef(false)

  const years = age - START_AGE
  const annual = daily * 365
  const invested = fv(annual, years)
  const spent = annual * years
  const benchmark = benchmarkFor(invested)

  React.useEffect(() => {
    if (age >= 60 && !awarded.current) {
      awarded.current = true
      unlockBadge('time-traveler')
      logInfo({
        title: 'Ran the Time Machine to retirement age',
        bias: 'Hyperbolic Discounting',
        detail: `A ${money(daily)}/day habit becomes ${money(
          fv(daily * 365, 60 - START_AGE),
        )} by 60 if invested instead.`,
      })
    }
  }, [age, daily, logInfo, unlockBadge])

  const data = Array.from({ length: years + 1 }, (_, i) => ({
    age: START_AGE + i,
    invested: Math.round(fv(annual, i)),
    spent: Math.round(annual * i),
  }))

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Coffee className="size-4 text-amber-400" /> Daily impulse spend
            </span>
            <span className="font-mono text-lg font-bold text-zinc-50">
              ${daily}
              <span className="text-xs text-zinc-500">/day</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={daily}
            onChange={(e) => setDaily(Number(e.target.value))}
            className="nudge-range mt-3 w-full"
            aria-label="Daily spend"
          />
          <p className="mt-2 text-[11px] text-zinc-500">
            The designer coffee, energy drink, or daily snack run.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Hourglass className="size-4 text-sky-400" /> Fast-forward to age
            </span>
            <span className="font-mono text-lg font-bold text-zinc-50">{age}</span>
          </div>
          <input
            type="range"
            min={19}
            max={68}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="nudge-range mt-3 w-full"
            aria-label="Target age"
          />
          <p className="mt-2 text-[11px] text-zinc-500">
            Drag from 19 to 68 and watch the gap explode.
          </p>
        </div>
      </div>

      {/* Big comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
          <div className="flex items-center gap-2 text-rose-300">
            <Coffee className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              What you actually bought
            </span>
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-zinc-50">
            {money(spent)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            spent over {years} years — gone, consumed, forgotten.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5">
          <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/15 blur-2xl" />
          <div className="flex items-center gap-2 text-emerald-300">
            <TrendingUp className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              If invested at 8%
            </span>
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-emerald-400 text-glow-emerald">
            {money(invested)}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {invested > spent
              ? `${money(invested - spent)} of that is pure compound growth.`
              : 'compounding is just getting started.'}
          </p>
        </div>
      </div>

      {benchmark && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent px-4 py-3 nudge-rise">
          <Sparkles className="size-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-zinc-200">
            At age {age}, your skipped ${daily}/day habit is worth{' '}
            <span className="font-semibold text-emerald-300">
              {benchmark.label}
            </span>
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Coins className="size-4 text-emerald-400" /> The compounding gap
          </h4>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-rose-300">
              <span className="size-2.5 rounded-sm bg-rose-500" /> Spent
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="size-2.5 rounded-sm bg-emerald-500" /> Invested
            </span>
          </div>
        </div>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 10, left: -6, bottom: 0 }}>
              <defs>
                <linearGradient id="tmInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93c2a1" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#93c2a1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tmSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e57a66" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#e57a66" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,70,58,0.25)" vertical={false} />
              <XAxis dataKey="age" tick={{ fill: '#8a6f5e', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#8a6f5e', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                contentStyle={{ background: '#1d1512', border: '1px solid #3a2c24', borderRadius: 12, color: '#f2e7d9', fontSize: 12 }}
                formatter={(v: number, n) => [money(v), n === 'invested' ? 'If invested' : 'Spent']}
                labelFormatter={(l) => `Age ${l}`}
              />
              <Area type="monotone" dataKey="spent" stroke="#e57a66" strokeWidth={2} fill="url(#tmSpent)" isAnimationActive={false} />
              <Area type="monotone" dataKey="invested" stroke="#93c2a1" strokeWidth={2.5} fill="url(#tmInvest)" isAnimationActive={false} />
              <ReferenceDot x={age} y={Math.round(invested)} r={5} fill="#93c2a1" stroke="#150f0d" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Hyperbolic discounting makes the ${daily} feel free because the reward
          is now and the cost is invisible. The Time Machine just makes the cost
          visible.
        </p>
      </div>
    </div>
  )
}
