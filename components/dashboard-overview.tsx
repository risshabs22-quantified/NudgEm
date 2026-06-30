'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Zap,
  SlidersHorizontal,
  Brain,
  ArrowRight,
  Sparkles,
  Wallet,
  TrendingDown,
  ShieldCheck,
  Gauge,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

function verdict(rationality: number) {
  if (rationality >= 90)
    return { label: 'Stoic Optimizer', tone: 'text-emerald-400' }
  if (rationality >= 70)
    return { label: 'Mostly Rational', tone: 'text-emerald-400' }
  if (rationality >= 45)
    return { label: 'Nudge-Susceptible', tone: 'text-amber-400' }
  if (rationality >= 20)
    return { label: 'Easily Nudged', tone: 'text-rose-400' }
  return { label: 'Marketer’s Dream', tone: 'text-rose-400' }
}

const QUICK = [
  {
    href: '/impulse-lab',
    label: 'The Impulse Lab',
    desc: 'Face a live dark-pattern checkout and see if you crack under manufactured urgency.',
    icon: Zap,
    accent: 'rose',
  },
  {
    href: '/bias-simulators',
    label: 'Bias Simulators',
    desc: 'Tune subscription defaults and run the framing A/B test on yourself.',
    icon: SlidersHorizontal,
    accent: 'amber',
  },
  {
    href: '/anatomy',
    label: 'The Anatomy of a Choice',
    desc: 'Dissect the 9 core biases marketers use — with defenses for each.',
    icon: Brain,
    accent: 'violet',
  },
] as const

const accentMap = {
  rose: 'from-rose-500/20 to-transparent text-rose-400 group-hover:border-rose-500/40',
  amber:
    'from-amber-500/20 to-transparent text-amber-400 group-hover:border-amber-500/40',
  violet:
    'from-violet-500/20 to-transparent text-violet-400 group-hover:border-violet-500/40',
}

export function DashboardOverview() {
  const {
    rationality,
    budget,
    startingBudget,
    trapsAvoided,
    trapsFallen,
    moneyLost,
  } = useNudge()
  const v = verdict(rationality)

  const stats = [
    {
      label: 'Rationality',
      value: `${rationality}%`,
      icon: Gauge,
      tone: rationality >= 70 ? 'text-emerald-400' : rationality >= 45 ? 'text-amber-400' : 'text-rose-400',
      sub: v.label,
    },
    {
      label: 'Budget left',
      value: `$${budget}`,
      icon: Wallet,
      tone: budget >= startingBudget ? 'text-emerald-400' : 'text-amber-400',
      sub: `of $${startingBudget}`,
    },
    {
      label: 'Traps avoided',
      value: `${trapsAvoided}`,
      icon: ShieldCheck,
      tone: 'text-emerald-400',
      sub: 'good calls',
    },
    {
      label: 'Lost to impulse',
      value: `$${moneyLost}`,
      icon: TrendingDown,
      tone: 'text-rose-400',
      sub: `${trapsFallen} slip-ups`,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/60 to-zinc-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 size-56 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            <Sparkles className="size-3" />
            Behavioral Economics, played — not read
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
            Your brain is being{' '}
            <span className="text-emerald-400 text-glow-emerald">nudged</span>{' '}
            right now.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            NudgeEm turns Nudge Theory into a live arena. Step into real
            simulations of scarcity, framing, and default bias — and watch your{' '}
            <span className="font-medium text-zinc-200">Rationality Score</span>{' '}
            and{' '}
            <span className="font-medium text-zinc-200">Psychological Budget</span>{' '}
            react to every choice you make.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/impulse-lab"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.03]"
            >
              Enter the Impulse Lab
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm">
              <span className="text-zinc-500">Current verdict:</span>
              <span className={cn('font-semibold', v.tone)}>{v.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {s.label}
                </span>
                <Icon className={cn('size-4', s.tone)} />
              </div>
              <p
                className={cn(
                  'mt-2 font-mono text-2xl font-bold tabular-nums',
                  s.tone,
                )}
              >
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{s.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        {QUICK.map((q) => {
          const Icon = q.icon
          return (
            <Link
              key={q.href}
              href={q.href}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:bg-zinc-900"
            >
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60',
                  accentMap[q.accent].split(' ').slice(0, 2).join(' '),
                )}
              />
              <div className="relative">
                <span
                  className={cn(
                    'flex size-11 items-center justify-center rounded-xl bg-zinc-800/80 transition-colors',
                    accentMap[q.accent].split(' ')[2],
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.25} />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-zinc-50">
                  {q.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {q.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-300 group-hover:text-zinc-100">
                  Open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
