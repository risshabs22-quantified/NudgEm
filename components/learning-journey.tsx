'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Flame,
  Gavel,
  ToggleRight,
  SplitSquareHorizontal,
  Salad,
  Landmark,
  Radar,
  Repeat,
  Hourglass,
  ScanLine,
  Check,
  Lock,
  ArrowRight,
  GraduationCap,
  Compass,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

/**
 * The connective spine of the whole app. Every lab on the site teaches one
 * named bias and, when you actually beat it, awards a specific badge. This
 * component reads those badges back out of global state and renders them as a
 * single curriculum — turning a grid of tools into a path with a beginning,
 * a sense of progress, and a clear "do this next."
 */

type Step = {
  badge: string
  title: string
  bias: string
  href: string
  icon: typeof Flame
  /** The one-line "what you'll learn / prove" hook. */
  blurb: string
  /** What unlocking this step's badge actually requires. */
  task: string
}

const STEPS: Step[] = [
  {
    badge: 'scarcity-skeptic',
    title: 'Beat the fake countdown',
    bias: 'Artificial Scarcity',
    href: '/impulse-lab',
    icon: Flame,
    blurb: 'A checkout screams "1 left, 2:00 to buy!" — none of it is real.',
    task: 'Skip the sneakers with a trap still running.',
  },
  {
    badge: 'sunk-cost-slayer',
    title: 'Walk away from the auction',
    bias: 'Sunk Cost Fallacy',
    href: '/impulse-lab',
    icon: Gavel,
    blurb: 'Bid on a $20 bill where the loser still pays. The only win is not playing.',
    task: 'Refuse to bid (or win it cheap) in the Escalation Pit.',
  },
  {
    badge: 'default-bias-defeater',
    title: 'Kill the auto-renew',
    bias: 'Default Bias',
    href: '/bias-simulators',
    icon: ToggleRight,
    blurb: 'The box is pre-checked because they know you won’t uncheck it.',
    task: 'Flip Auto-Renewal OFF in the Subscription Trap.',
  },
  {
    badge: 'frame-proof-analyst',
    title: 'See past the wording',
    bias: 'Framing & Loss Aversion',
    href: '/bias-simulators',
    icon: SplitSquareHorizontal,
    blurb: '"Keep $200" and "Lose $400" are the same money — one just hurts more.',
    task: 'Pick the loss frame in the Framing test.',
  },
  {
    badge: 'architect-of-good',
    title: 'Redesign the lunch line',
    bias: 'Choice Architecture',
    href: '/cafeteria',
    icon: Salad,
    blurb: 'Now use the tricks for good — change behavior without banning a thing.',
    task: 'Hit the +40% healthy goal in the Cafeteria.',
  },
  {
    badge: 'policy-whisperer',
    title: 'Nudge a whole country',
    bias: 'Public Policy Nudges',
    href: '/macro-lab',
    icon: Landmark,
    blurb: 'Default pension enrollment, opt-out organ donation — scale it to millions.',
    task: 'Hit 3+ national targets in the Macro Lab.',
  },
  {
    badge: 'self-aware',
    title: 'Map your own weak spots',
    bias: 'Self-Knowledge',
    href: '/bias-radar',
    icon: Radar,
    blurb: 'Ten questions that reveal exactly which biases own you.',
    task: 'Answer all 10 questions in the Bias Radar.',
  },
  {
    badge: 'habit-hacker',
    title: 'Engineer a habit',
    bias: 'Friction & Habit Loops',
    href: '/habit-loop',
    icon: Repeat,
    blurb: 'Add one speed bump and watch a bad loop quietly fall apart.',
    task: 'Drop a friction step into the Habit Loop.',
  },
  {
    badge: 'time-traveler',
    title: 'Fast-forward your future',
    bias: 'Hyperbolic Discounting',
    href: '/time-machine',
    icon: Hourglass,
    blurb: 'Feel why today-you keeps robbing retirement-you, in compounding dollars.',
    task: 'Drag the Time Machine to age 60+.',
  },
  {
    badge: 'trap-spotter',
    title: 'Scan a live checkout',
    bias: 'Pattern Recognition',
    href: '/trap-scanner',
    icon: ScanLine,
    blurb: 'Graduation: spot every dirty pattern in a page at a glance.',
    task: 'Scan the example checkout in the Trap Scanner.',
  },
]

const accent = {
  done: {
    node: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300',
    ring: 'ring-emerald-500/30',
    line: 'bg-emerald-500/40',
  },
  current: {
    node: 'border-amber-400/70 bg-amber-500/15 text-amber-300',
    ring: 'ring-amber-500/40',
    line: 'bg-zinc-800',
  },
  locked: {
    node: 'border-zinc-700 bg-zinc-800/60 text-zinc-500',
    ring: 'ring-transparent',
    line: 'bg-zinc-800',
  },
}

function rank(done: number, total: number) {
  const p = done / total
  if (done === 0) return 'Easily Nudged'
  if (p < 0.34) return 'Waking Up'
  if (p < 0.67) return 'Catching the Tricks'
  if (p < 1) return 'Hard to Fool'
  return 'Nudge-Immune'
}

export function LearningJourney() {
  const { badges } = useNudge()
  const done = STEPS.filter((s) => badges.includes(s.badge)).length
  const total = STEPS.length
  const pct = Math.round((done / total) * 100)
  const nextIndex = STEPS.findIndex((s) => !badges.includes(s.badge))
  const finished = nextIndex === -1
  const next = finished ? null : STEPS[nextIndex]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/70 to-zinc-950">
      <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 size-64 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 p-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            <Compass className="size-3" /> Your path
          </span>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-zinc-50">
            From easily nudged to nudge-immune
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-400">
            Ten labs, one arc. Each one teaches a single bias and gives you a
            badge the moment you actually beat it. Walk the path top to bottom
            and watch yourself get harder to fool.
          </p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3">
          <div className="relative grid size-20 place-items-center">
            <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="rgba(58,44,36,0.7)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#3fb950"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute text-center">
              <div className="font-mono text-base font-bold leading-none text-emerald-400">
                {done}/{total}
              </div>
              <div className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-500">
                labs
              </div>
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Current rank
            </div>
            <div className="font-serif text-lg font-semibold text-zinc-100">
              {rank(done, total)}
            </div>
          </div>
        </div>
      </div>

      {/* Next-up CTA */}
      {next ? (
        <div className="relative flex flex-wrap items-center gap-3 border-b border-zinc-800/80 bg-amber-500/5 px-6 py-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Do this next
          </span>
          <span className="text-sm text-zinc-200">
            <span className="font-semibold text-zinc-50">{next.title}</span>
            <span className="text-zinc-500"> — {next.task}</span>
          </span>
          <Link
            href={next.href}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.03]"
          >
            Start it
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="relative flex items-center gap-3 border-b border-zinc-800/80 bg-emerald-500/5 px-6 py-4">
          <GraduationCap className="size-5 text-emerald-400" />
          <p className="text-sm text-zinc-200">
            <span className="font-semibold text-emerald-300">
              Path complete.
            </span>{' '}
            You beat all ten biases. Head to the{' '}
            <Link href="/trophy-room" className="font-semibold text-emerald-400 underline-offset-2 hover:underline">
              Master Room
            </Link>{' '}
            to see your full record.
          </p>
        </div>
      )}

      {/* The path */}
      <ol className="relative p-4 sm:p-6">
        {STEPS.map((step, i) => {
          const isDone = badges.includes(step.badge)
          const isCurrent = !isDone && i === nextIndex
          const state = isDone ? 'done' : isCurrent ? 'current' : 'locked'
          const a = accent[state]
          const Icon = step.icon
          const isLast = i === STEPS.length - 1
          return (
            <li key={step.badge} className="relative flex gap-4 pb-4 last:pb-0">
              {/* Rail */}
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    'z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl border ring-4 transition-colors',
                    a.node,
                    a.ring,
                  )}
                >
                  {isDone ? (
                    <Check className="size-5" strokeWidth={2.75} />
                  ) : isCurrent ? (
                    <Icon className="size-5" strokeWidth={2.25} />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      'w-0.5 flex-1 rounded-full',
                      isDone ? accent.done.line : 'bg-zinc-800',
                    )}
                  />
                )}
              </div>

              {/* Card */}
              <Link
                href={step.href}
                className={cn(
                  'group mb-0 flex flex-1 flex-col gap-1 rounded-2xl border p-4 transition-all',
                  isCurrent
                    ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60'
                    : isDone
                      ? 'border-emerald-500/25 bg-emerald-500/[0.04] hover:border-emerald-500/40'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-zinc-50">
                      {step.title}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      isDone
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : isCurrent
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-zinc-800 text-zinc-500',
                    )}
                  >
                    {isDone ? 'Mastered' : isCurrent ? 'Up next' : 'Locked'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {step.blurb}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                    {step.bias}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-zinc-200">
                    {isDone ? 'Replay' : 'Open lab'}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
