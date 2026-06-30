'use client'

import * as React from 'react'
import {
  TrendingDown,
  TrendingUp,
  Info,
  Activity,
  Trophy,
  AlertTriangle,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

function timeAgo(at: number) {
  const s = Math.floor((Date.now() - at) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return `${h}h ago`
}

export function ActivityLog() {
  const { events } = useNudge()
  // Re-render every 15s so relative timestamps stay fresh.
  const [, force] = React.useReducer((x) => x + 1, 0)
  React.useEffect(() => {
    const id = setInterval(force, 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-zinc-100">Decision Ledger</h3>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          live
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Trophy className="size-7 text-zinc-700" />
          <p className="mt-2 text-sm text-zinc-400">No decisions logged yet</p>
          <p className="mt-1 max-w-xs text-xs text-zinc-600">
            Head into a simulator. Every choice you make shows up here with the
            bias it triggered.
          </p>
        </div>
      ) : (
        <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto nudge-scroll pr-1">
          {events.map((e) => {
            const isTrap = e.kind === 'trap'
            const isGood = e.kind === 'good'
            const Icon = isTrap ? TrendingDown : isGood ? TrendingUp : Info
            return (
              <li
                key={e.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3',
                  isTrap
                    ? 'border-rose-500/20 bg-rose-500/5'
                    : isGood
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-zinc-800 bg-zinc-800/30',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg',
                    isTrap
                      ? 'bg-rose-500/15 text-rose-400'
                      : isGood
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-zinc-700/50 text-zinc-300',
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-zinc-100">
                      {e.title}
                    </p>
                    <span className="shrink-0 text-[10px] text-zinc-600">
                      {timeAgo(e.at)}
                    </span>
                  </div>
                  {e.bias && (
                    <span
                      className={cn(
                        'mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        isTrap
                          ? 'bg-rose-500/10 text-rose-300'
                          : isGood
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-zinc-700/40 text-zinc-300',
                      )}
                    >
                      <AlertTriangle className="size-2.5" />
                      {e.bias}
                    </span>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    {typeof e.amount === 'number' && e.amount !== 0 && (
                      <span className="font-mono text-rose-400">
                        ${e.amount}
                      </span>
                    )}
                    {typeof e.rationality === 'number' && e.rationality !== 0 && (
                      <span
                        className={cn(
                          'font-mono',
                          e.rationality > 0 ? 'text-emerald-400' : 'text-rose-400',
                        )}
                      >
                        {e.rationality > 0 ? '+' : ''}
                        {e.rationality}% rationality
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
