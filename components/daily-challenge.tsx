'use client'

import * as React from 'react'
import {
  Brain,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Option = { label: string; correct: boolean }
type Scenario = {
  prompt: string
  bias: string
  options: Option[]
  explain: string
}

const SCENARIOS: Scenario[] = [
  {
    prompt:
      'An airline page screams "Only 1 ticket left at this price!" Upgrading to lock it in costs $50. What do you do?',
    bias: 'Artificial Scarcity',
    options: [
      { label: 'Pay $50 now before it sells out', correct: false },
      { label: 'Open a new tab and compare dates/sites first', correct: true },
    ],
    explain:
      'Airline "1 left" banners are manufactured urgency that often reset on refresh. A few minutes of comparison almost always beats panic-paying a $50 premium.',
  },
  {
    prompt:
      'A free trial quietly converts to $14.99/mo after 7 days. You only need it once. What do you do?',
    bias: 'Default Bias',
    options: [
      { label: 'Sign up and remember to cancel later', correct: false },
      { label: 'Set a cancel reminder now — or skip it', correct: true },
    ],
    explain:
      'Auto-renew relies on you forgetting. The default is designed to win; pre-committing to cancel (or not starting) is the only reliable defense.',
  },
  {
    prompt:
      'A stock is up 300% this week and your whole feed is buying. What do you do?',
    bias: 'Herd Mentality',
    options: [
      { label: 'Buy in before you miss the run', correct: false },
      { label: 'Stay out — "everyone is buying" is not a thesis', correct: true },
    ],
    explain:
      'Social proof feels like evidence but crowds usually pile in at the top. If your only reason is that others are buying, that is FOMO, not analysis.',
  },
  {
    prompt:
      'Checkout shows "Members who bought this also added a $40 case." Your cart is complete. What do you do?',
    bias: 'Social Proof Upsell',
    options: [
      { label: 'Add the case — others did', correct: false },
      { label: 'Stick to what you came for', correct: true },
    ],
    explain:
      '"Others also bought" is a social-proof upsell engineered to inflate basket size. What strangers bought says nothing about what you actually need.',
  },
  {
    prompt:
      'A "$129, now $39!" gadget you never planned to buy pops up. What do you do?',
    bias: 'Anchoring Effect',
    options: [
      { label: 'Grab it — that is 70% off!', correct: false },
      { label: 'Ignore it; I never wanted it at any price', correct: true },
    ],
    explain:
      'The $129 anchor makes $39 feel like a win, but a discount on something you do not need is still 100% wasted. The anchor, not the value, created the urge.',
  },
  {
    prompt:
      'You\'ve spent 40 hours in a game; a $25 "completionist" pack appears after a tough loss. What do you do?',
    bias: 'Sunk Cost Fallacy',
    options: [
      { label: "Buy it — I've already invested so much", correct: false },
      { label: 'Judge the $25 on its own merits today', correct: true },
    ],
    explain:
      'Past hours are gone whether or not you pay. "I\'ve already invested" is the sunk-cost trap; only future value versus future cost should decide.',
  },
]

function todayScenario(): { scenario: Scenario; index: number } {
  const index = Math.floor(Date.now() / 86_400_000) % SCENARIOS.length
  return { scenario: SCENARIOS[index], index }
}

export function DailyChallenge() {
  const { applyOutcome, dailyAnswered, markDailyAnswered } = useNudge()
  const { scenario } = React.useMemo(todayScenario, [])
  const [picked, setPicked] = React.useState<number | null>(null)

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const correct = scenario.options[i].correct
    markDailyAnswered()
    applyOutcome({
      kind: correct ? 'good' : 'trap',
      rationalityDelta: correct ? 4 : -6,
      budgetDelta: correct ? 0 : -15,
      title: correct ? 'Daily Nudge: passed' : 'Daily Nudge: caught out',
      bias: scenario.bias,
      detail: scenario.explain,
    })
  }

  // Already answered in a previous session (state persisted) but no local pick.
  if (dailyAnswered && picked === null) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Daily Brain Teaser — complete
            </h3>
            <p className="text-xs text-zinc-500">
              You&apos;ve done today&apos;s teaser. Reset the simulation for a fresh one.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const result = picked !== null ? scenario.options[picked].correct : null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300">
          <Sparkles className="size-3" /> Daily Brain Teaser
        </span>
        {picked === null && (
          <span className="text-[11px] text-zinc-500">+4% / −6% rationality</span>
        )}
      </div>

      <h3 className="relative mt-3 font-serif text-lg font-semibold text-zinc-50">
        {scenario.prompt}
      </h3>

      <div className="relative mt-4 grid gap-2.5 sm:grid-cols-2">
        {scenario.options.map((opt, i) => {
          const chosen = picked === i
          const showState = picked !== null
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={picked !== null}
              className={cn(
                'rounded-xl border px-4 py-3 text-left text-sm transition-all',
                !showState && 'border-zinc-700 bg-zinc-800/40 text-zinc-200 hover:scale-[1.01] hover:border-amber-500/40',
                showState && opt.correct && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100',
                showState && !opt.correct && chosen && 'border-rose-500/50 bg-rose-500/10 text-rose-100',
                showState && !opt.correct && !chosen && 'border-zinc-800 bg-zinc-900/40 text-zinc-500',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                {opt.label}
                {showState && opt.correct && <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />}
                {showState && !opt.correct && chosen && <XCircle className="size-4 shrink-0 text-rose-400" />}
              </span>
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div
          className={cn(
            'relative mt-4 rounded-xl border p-3 nudge-rise',
            result ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5',
          )}
        >
          <p className={cn('flex items-center gap-1.5 text-xs font-semibold', result ? 'text-emerald-300' : 'text-rose-300')}>
            <Brain className="size-3.5" />
            {result ? 'Sharp.' : 'Gotcha.'} The trap: {scenario.bias}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
            {scenario.explain}
          </p>
        </div>
      )}
    </div>
  )
}
