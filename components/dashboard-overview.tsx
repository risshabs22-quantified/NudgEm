'use client'

import * as React from 'react'
import Link from 'next/link'
import {
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
    return { label: 'Basically Unhackable', tone: 'text-emerald-400' }
  if (rationality >= 70)
    return { label: 'Pretty Switched On', tone: 'text-emerald-400' }
  if (rationality >= 45)
    return { label: 'Kinda Easy to Trick', tone: 'text-amber-400' }
  if (rationality >= 20)
    return { label: 'Marketers Love You', tone: 'text-rose-400' }
  return { label: 'A Marketer’s Dream', tone: 'text-rose-400' }
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
      label: 'Cash left',
      value: `$${budget}`,
      icon: Wallet,
      tone: budget >= startingBudget ? 'text-emerald-400' : 'text-amber-400',
      sub: `of $${startingBudget}`,
    },
    {
      label: 'Traps dodged',
      value: `${trapsAvoided}`,
      icon: ShieldCheck,
      tone: 'text-emerald-400',
      sub: 'nice',
    },
    {
      label: 'Wasted on impulse',
      value: `$${moneyLost}`,
      icon: TrendingDown,
      tone: 'text-rose-400',
      sub: `${trapsFallen} oof moments`,
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
            Behavioral econ you can actually play
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
            Your brain is getting{' '}
            <span className="text-emerald-400 text-glow-emerald">played</span>{' '}
            right now.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Every app you open is nudging you to spend. NudgeEm does it on
            purpose so you can feel it happening. Mess with the simulators and
            watch your{' '}
            <span className="font-medium text-zinc-200">Rationality Score</span>{' '}
            and{' '}
            <span className="font-medium text-zinc-200">Psychological Budget</span>{' '}
            move with every choice you make.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/impulse-lab"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.03]"
            >
              See if you can be tricked
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm">
              <span className="text-zinc-500">Right now you’re:</span>
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
    </div>
  )
}
