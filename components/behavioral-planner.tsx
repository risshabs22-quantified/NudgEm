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
  Legend,
} from 'recharts'
import {
  Wallet,
  Clock,
  Lock,
  Plus,
  Trash2,
  TrendingUp,
  PiggyBank,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Expense = { id: string; label: string; amount: number; impulse?: boolean }

const uid = () => Math.random().toString(36).slice(2, 9)
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const DEFAULT_EXPENSES: Expense[] = [
  { id: uid(), label: 'Rent / housing', amount: 1400 },
  { id: uid(), label: 'Groceries', amount: 450 },
  { id: uid(), label: 'Subscriptions', amount: 80 },
  { id: uid(), label: 'Transport', amount: 160 },
  { id: uid(), label: 'Impulse / fun spending', amount: 400, impulse: true },
]

const FRICTION_CUT = 0.3 // 24h hold abandons ~30% of impulse buys
const BUCKET_LEAK_CUT = 0.08 // envelopes stop ~8% of discretionary leaking

export function BehavioralPlanner() {
  const [income, setIncome] = React.useState(3200)
  const [expenses, setExpenses] = React.useState<Expense[]>(DEFAULT_EXPENSES)
  const [friction, setFriction] = React.useState(false)
  const [buckets, setBuckets] = React.useState(false)

  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const impulseTotal = expenses
    .filter((e) => e.impulse)
    .reduce((s, e) => s + (e.amount || 0), 0)
  const baseSavings = Math.max(0, income - totalExpenses)
  const discretionary = Math.max(0, income - (totalExpenses - impulseTotal))

  const frictionSaved = friction ? impulseTotal * FRICTION_CUT : 0
  const bucketsSaved = buckets ? discretionary * BUCKET_LEAK_CUT : 0
  const newSavings = baseSavings + frictionSaved + bucketsSaved
  const extra = newSavings - baseSavings
  const improvementPct = baseSavings > 0 ? (extra / baseSavings) * 100 : 0

  const update = (id: string, patch: Partial<Expense>) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  const remove = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  const add = () =>
    setExpenses((prev) => [...prev, { id: uid(), label: 'New expense', amount: 0 }])

  // 24-month cumulative forecast.
  const forecast = Array.from({ length: 13 }, (_, m) => ({
    month: `M${m * 2}`,
    standard: Math.round(baseSavings * m * 2),
    nudged: Math.round(newSavings * m * 2),
  }))

  const envelopes = [
    { label: 'Future / Savings', pct: 0.5, tone: 'emerald' as const },
    { label: 'Needs', pct: 0.3, tone: 'sky' as const },
    { label: 'Wants', pct: 0.2, tone: 'amber' as const },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Inputs */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Wallet className="size-4 text-emerald-400" /> Monthly income
          </h4>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-3">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              value={income}
              min={0}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent py-2.5 font-mono text-lg font-bold text-zinc-50 focus:outline-none"
            />
            <span className="text-xs text-zinc-500">/mo</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Recurring expenses
            </h5>
            <button
              onClick={add}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/60 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
            >
              <Plus className="size-3" /> Add
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center gap-2">
                <input
                  value={e.label}
                  onChange={(ev) => update(e.id, { label: ev.target.value })}
                  className={cn(
                    'min-w-0 flex-1 rounded-lg border bg-zinc-800/40 px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none',
                    e.impulse ? 'border-rose-500/30' : 'border-zinc-700',
                  )}
                />
                <div className="flex w-24 items-center rounded-lg border border-zinc-700 bg-zinc-800/40 px-2">
                  <span className="text-xs text-zinc-500">$</span>
                  <input
                    type="number"
                    value={e.amount}
                    min={0}
                    onChange={(ev) =>
                      update(e.id, { amount: Math.max(0, Number(ev.target.value)) })
                    }
                    className="w-full bg-transparent py-1.5 text-right font-mono text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => remove(e.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-800 hover:text-rose-400"
                  aria-label="Remove"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Tip: the rose-bordered row is impulse spend — that's what the 24-hour hold targets.
          </p>
        </div>

        {/* Nudge protocols */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Sparkles className="size-4 text-emerald-400" /> Speed bumps
          </h4>
          <ProtocolToggle
            on={friction}
            onToggle={() => setFriction((v) => !v)}
            icon={Clock}
            title="24-hour wait"
            desc="Hold non-essentials for a day before buying. ~30% of impulse buys never come back."
          />
          <ProtocolToggle
            on={buckets}
            onToggle={() => setBuckets((v) => !v)}
            icon={Lock}
            title="Locked buckets"
            desc="Split money into labeled envelopes so it stops feeling like one big pile to spend."
          />

          {buckets && (
            <div className="mt-3 grid grid-cols-3 gap-2 nudge-rise">
              {envelopes.map((en) => (
                <div
                  key={en.label}
                  className={cn(
                    'rounded-xl border p-2.5 text-center',
                    en.tone === 'emerald'
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : en.tone === 'sky'
                        ? 'border-sky-500/30 bg-sky-500/10'
                        : 'border-amber-500/30 bg-amber-500/10',
                  )}
                >
                  <Lock
                    className={cn(
                      'mx-auto size-3.5',
                      en.tone === 'emerald'
                        ? 'text-emerald-400'
                        : en.tone === 'sky'
                          ? 'text-sky-400'
                          : 'text-amber-400',
                    )}
                  />
                  <p className="mt-1 font-mono text-sm font-bold text-zinc-100">
                    {money(discretionary * en.pct)}
                  </p>
                  <p className="text-[10px] text-zinc-500">{en.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Forecast */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Saved / mo now
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-zinc-100">
              {money(baseSavings)}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300">
              Saved / mo with nudges
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
              {money(newSavings)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-emerald-300/80">
              <TrendingUp className="size-3" /> +{Math.round(improvementPct)}% (
              {money(extra)}/mo)
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <PiggyBank className="size-4 text-emerald-400" /> 24-month savings
              forecast
            </h4>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-zinc-400">
                <span className="size-2.5 rounded-sm bg-zinc-500" /> Standard
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="size-2.5 rounded-sm bg-emerald-500" /> With nudges
              </span>
            </div>
          </div>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 8, right: 6, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gNudged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3fb950" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3fb950" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gStandard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6e7681" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6e7681" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,70,58,0.25)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#6e7681', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#6e7681', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{ background: '#161b22', border: '1px solid #2a313c', borderRadius: 12, color: '#e6edf3', fontSize: 12 }}
                  formatter={(v: number, n) => [money(v), n === 'nudged' ? 'With nudges' : 'Standard']}
                />
                <Area type="monotone" dataKey="standard" stroke="#6e7681" strokeWidth={2} fill="url(#gStandard)" isAnimationActive={false} />
                <Area type="monotone" dataKey="nudged" stroke="#3fb950" strokeWidth={2.5} fill="url(#gNudged)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Behavioral friction isn't about suffering — it just kills autopilot.
            Over two years that's an extra{' '}
            <span className="font-semibold text-emerald-300">
              {money(extra * 24)}
            </span>{' '}
            kept, with no change to your income.
          </p>
        </div>
      </div>
    </div>
  )
}

function ProtocolToggle({
  on,
  onToggle,
  icon: Icon,
  title,
  desc,
}: {
  on: boolean
  onToggle: () => void
  icon: typeof Clock
  title: string
  desc: string
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'mt-3 flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-all',
        on ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-800/30',
      )}
    >
      <span className="flex items-start gap-2.5">
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg',
            on ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500',
          )}
        >
          <Icon className="size-4" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-zinc-100">{title}</span>
          <span className="block text-[11px] leading-relaxed text-zinc-500">{desc}</span>
        </span>
      </span>
      <span
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
          on ? 'bg-emerald-500' : 'bg-zinc-700',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white transition-all',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  )
}
