'use client'

import * as React from 'react'
import { Brain, Wallet, TrendingDown, TrendingUp, ShieldCheck } from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { useAnimatedNumber } from '@/hooks/use-animated-number'
import { cn } from '@/lib/utils'

function rationalityColor(score: number) {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 45) return 'text-amber-400'
  return 'text-rose-400'
}
function rationalityBar(score: number) {
  if (score >= 75) return 'from-emerald-500 to-emerald-400'
  if (score >= 45) return 'from-amber-500 to-amber-400'
  return 'from-rose-500 to-rose-400'
}

export function MetricTicker({ compact = false }: { compact?: boolean }) {
  const { rationality, budget, startingBudget, trapsFallen, trapsAvoided } =
    useNudge()
  const animScore = useAnimatedNumber(rationality)
  const animBudget = useAnimatedNumber(budget)

  return (
    <div
      className={cn(
        'flex flex-wrap items-stretch gap-2 sm:gap-3',
        compact ? '' : 'w-full',
      )}
    >
      {/* Rationality */}
      <div className="group relative flex min-w-[160px] flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 backdrop-blur">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80',
            rationalityColor(rationality),
          )}
        >
          <Brain className="size-4.5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Rationality Score
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                'font-mono text-lg font-bold tabular-nums leading-none',
                rationalityColor(rationality),
              )}
            >
              {Math.round(animScore)}%
            </span>
          </div>
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={cn(
                'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                rationalityBar(rationality),
              )}
              style={{ width: `${rationality}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="relative flex min-w-[160px] flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 backdrop-blur">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80',
            budget >= startingBudget ? 'text-emerald-400' : 'text-amber-400',
          )}
        >
          <Wallet className="size-4.5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Psychological Budget
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-lg font-bold tabular-nums leading-none text-zinc-100">
              ${Math.round(animBudget)}
            </span>
            <span className="text-[11px] text-zinc-600">/ ${startingBudget}</span>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 backdrop-blur md:flex">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 text-emerald-400">
              <ShieldCheck className="size-4.5" strokeWidth={2.25} />
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Traps Avoided
              </div>
              <div className="flex items-center gap-1 font-mono text-lg font-bold tabular-nums leading-none text-emerald-400">
                <TrendingUp className="size-3.5" /> {trapsAvoided}
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 backdrop-blur md:flex">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 text-rose-400">
              <TrendingDown className="size-4.5" strokeWidth={2.25} />
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Traps Sprung
              </div>
              <div className="font-mono text-lg font-bold tabular-nums leading-none text-rose-400">
                {trapsFallen}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
