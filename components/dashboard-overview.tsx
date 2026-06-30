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
      {/* Editorial masthead */}
      <div className="border-b border-zinc-800 pb-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
          <Sparkles className="size-3.5" />
          Behavioral economics, played not read
        </p>
        <div className="mt-4 grid items-end gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-zinc-50 sm:text-[2.6rem]">
              Your brain is getting{' '}
              <span className="text-emerald-400">played</span> right now.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Every app you open is nudging you to spend. NudgeEm does it on
              purpose so you can feel it happening. Mess with the simulators and
              watch your{' '}
              <span className="font-medium text-zinc-200">Rationality Score</span>{' '}
              and{' '}
              <span className="font-medium text-zinc-200">
                Psychological Budget
              </span>{' '}
              move with every choice you make.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex items-baseline gap-2 border-l-2 border-zinc-700 pl-3 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-3 lg:text-right">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Verdict
              </span>
              <span className={cn('font-serif text-lg font-semibold', v.tone)}>
                {v.label}
              </span>
            </div>
            <Link
              href="/impulse-lab"
              className="group inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              See if you can be tricked
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat strip — one panel, divided */}
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-800 overflow-hidden rounded-md border border-zinc-800 sm:grid-cols-4 sm:divide-y-0">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-zinc-900/40 p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                <Icon className={cn('size-3.5', s.tone)} />
                {s.label}
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
