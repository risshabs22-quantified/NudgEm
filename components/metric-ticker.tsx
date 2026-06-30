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
  if (score >= 75) return 'bg-emerald-500'
  if (score >= 45) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function MetricTicker({ compact = false }: { compact?: boolean }) {
  const { rationality, budget, startingBudget, trapsFallen, trapsAvoided } =
    useNudge()
  const animScore = useAnimatedNumber(rationality)
  const animBudget = useAnimatedNumber(budget)

  return (
    <div
      className={cn(
        'flex items-stretch divide-x divide-zinc-800 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50',
        compact ? '' : 'w-full',
      )}
    >
      {/* Rationality */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 py-2">
        <Brain
          className={cn('size-4 shrink-0', rationalityColor(rationality))}
          strokeWidth={2.25}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Rationality
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-mono text-base font-bold tabular-nums leading-none',
                rationalityColor(rationality),
              )}
            >
              {Math.round(animScore)}%
            </span>
            <div className="hidden h-1 flex-1 overflow-hidden rounded-full bg-zinc-800 sm:block">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  rationalityBar(rationality),
                )}
                style={{ width: `${rationality}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 py-2">
        <Wallet
          className={cn(
            'size-4 shrink-0',
            budget >= startingBudget ? 'text-emerald-400' : 'text-amber-400',
          )}
          strokeWidth={2.25}
        />
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Budget
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold tabular-nums leading-none text-zinc-100">
              ${Math.round(animBudget)}
            </span>
            <span className="text-[11px] text-zinc-600">/ ${startingBudget}</span>
          </div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="hidden min-w-0 items-center gap-2.5 px-3.5 py-2 md:flex">
            <ShieldCheck className="size-4 shrink-0 text-emerald-400" strokeWidth={2.25} />
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Avoided
              </div>
              <div className="flex items-center gap-1 font-mono text-base font-bold tabular-nums leading-none text-emerald-400">
                <TrendingUp className="size-3.5" /> {trapsAvoided}
              </div>
            </div>
          </div>
          <div className="hidden min-w-0 items-center gap-2.5 px-3.5 py-2 md:flex">
            <TrendingDown className="size-4 shrink-0 text-rose-400" strokeWidth={2.25} />
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Sprung
              </div>
              <div className="font-mono text-base font-bold tabular-nums leading-none text-rose-400">
                {trapsFallen}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
