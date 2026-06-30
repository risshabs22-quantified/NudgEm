'use client'

import * as React from 'react'
import { X, Trophy } from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { badgeById } from '@/lib/badges'

const CONFETTI_COLORS = [
  '#3fb950',
  '#d29922',
  '#e57a66',
  '#b594ce',
  '#7bb2c0',
  '#e6edf3',
]

function Confetti() {
  // Generate a stable burst once per mount.
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 18 + Math.random()
        const dist = 50 + Math.random() * 70
        return {
          id: i,
          cx: `${Math.cos(angle) * dist}px`,
          cy: `${Math.sin(angle) * dist + 40}px`,
          cr: `${Math.random() * 540 - 270}deg`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: `${Math.random() * 0.15}s`,
          size: 6 + Math.round(Math.random() * 5),
        }
      }),
    [],
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="nudge-confetti-piece absolute block rounded-[2px]"
          style={
            {
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: p.delay,
              ['--cx' as string]: p.cx,
              ['--cy' as string]: p.cy,
              ['--cr' as string]: p.cr,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function BadgeToaster() {
  const { recentBadge, clearRecentBadge } = useNudge()

  React.useEffect(() => {
    if (!recentBadge) return
    const t = setTimeout(() => clearRecentBadge(), 5000)
    return () => clearTimeout(t)
  }, [recentBadge, clearRecentBadge])

  if (!recentBadge) return null
  const badge = badgeById(recentBadge)
  if (!badge) return null
  const Icon = badge.icon

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <div className="pointer-events-auto relative nudge-pop-in">
        <Confetti />
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-500/40 bg-zinc-900/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent" />
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/30">
            <Icon className="size-6" strokeWidth={2.25} />
          </span>
          <div className="relative min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              <Trophy className="size-3" /> Badge unlocked
            </p>
            <p className="truncate font-serif text-base font-semibold text-zinc-50">
              {badge.name}
            </p>
            <p className="truncate text-[11px] text-zinc-400">
              {badge.description}
            </p>
          </div>
          <button
            onClick={clearRecentBadge}
            className="relative ml-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
