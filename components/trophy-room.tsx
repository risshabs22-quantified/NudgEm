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
  Trophy,
  Lock,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Target,
  Sparkles,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { BADGES } from '@/lib/badges'
import { cn } from '@/lib/utils'

export function TrophyRoom() {
  const {
    badges,
    rationality,
    trapsAvoided,
    trapsFallen,
    decisions,
    moneyLost,
    moneySaved,
  } = useNudge()

  const unlocked = BADGES.filter((b) => badges.includes(b.id)).length
  const total = BADGES.length
  const pct = Math.round((unlocked / total) * 100)
  const totalTraps = trapsAvoided + trapsFallen
  const accuracy = totalTraps > 0 ? Math.round((trapsAvoided / totalTraps) * 100) : 0

  const trapData = [
    { name: 'Avoided', value: trapsAvoided },
    { name: 'Sprung', value: trapsFallen },
  ]

  const stats = [
    {
      label: 'Rationality',
      value: `${rationality}%`,
      icon: Gauge,
      tone: rationality >= 70 ? 'text-emerald-400' : rationality >= 45 ? 'text-amber-400' : 'text-rose-400',
    },
    { label: 'Decisions made', value: `${decisions}`, icon: Target, tone: 'text-zinc-100' },
    { label: 'Defense accuracy', value: `${accuracy}%`, icon: ShieldCheck, tone: 'text-emerald-400' },
    { label: 'Lost to traps', value: `$${moneyLost}`, icon: TrendingDown, tone: 'text-rose-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Progress hero */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <Trophy className="size-3" /> Cognitive Master Room
            </span>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-zinc-50">
              {unlocked} of {total} badges earned
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Each badge means you actually did something smart somewhere on the site.
            </p>
          </div>
          <div className="flex size-20 items-center justify-center rounded-full border-4 border-emerald-500/30">
            <span className="font-mono text-xl font-bold text-emerald-400">
              {pct}%
            </span>
          </div>
        </div>
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                    {s.label}
                  </span>
                  <Icon className={cn('size-4', s.tone)} />
                </div>
                <p className={cn('mt-2 font-mono text-2xl font-bold', s.tone)}>
                  {s.value}
                </p>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h4 className="text-sm font-semibold text-zinc-100">Traps avoided vs sprung</h4>
          <div className="mt-2 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trapData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,70,58,0.25)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a6f5e', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(58,44,36,0.3)' }}
                  contentStyle={{ background: '#161b22', border: '1px solid #2a313c', borderRadius: 12, color: '#e6edf3', fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  <Cell fill="#3fb950" />
                  <Cell fill="#e57a66" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-zinc-50">
          <Sparkles className="size-4 text-emerald-400" /> The Trophy Cabinet
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => {
            const has = badges.includes(b.id)
            const Icon = b.icon
            return (
              <div
                key={b.id}
                className={cn(
                  'flex gap-3 rounded-2xl border p-4 transition-all',
                  has
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-zinc-800 bg-zinc-900/40',
                )}
              >
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-xl',
                    has
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-600',
                  )}
                >
                  {has ? <Icon className="size-6" strokeWidth={2.25} /> : <Lock className="size-5" />}
                </span>
                <div className="min-w-0">
                  <p className={cn('font-serif text-base font-semibold', has ? 'text-zinc-50' : 'text-zinc-400')}>
                    {b.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                    {has ? b.description : b.hint}
                  </p>
                  <span
                    className={cn(
                      'mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      has ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-800 text-zinc-500',
                    )}
                  >
                    {has ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
