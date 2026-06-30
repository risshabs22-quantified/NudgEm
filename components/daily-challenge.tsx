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
      'Booking a flight and the site goes "Only 1 seat left at this price!!" Locking it costs an extra $50. Move?',
    bias: 'Artificial Scarcity',
    options: [
      { label: 'Pay the $50 before it’s gone', correct: false },
      { label: 'New tab, compare, chill for 5 min', correct: true },
    ],
    explain:
      'That "1 left" banner is fake — refresh and it usually resets. Five minutes of looking beats panic-paying $50 every time.',
  },
  {
    prompt:
      'Free trial turns into $14.99/mo after a week. You\'ll use it like twice. What do you do?',
    bias: 'Default Bias',
    options: [
      { label: 'Sign up, I’ll cancel later (I won’t)', correct: false },
      { label: 'Set a cancel reminder now, or just don’t', correct: true },
    ],
    explain:
      'The whole plan is you forgetting. The default is built to win. Set the reminder the second you sign up, or skip it entirely.',
  },
  {
    prompt:
      'A coin is up 300% this week and literally everyone on your FYP is buying. You?',
    bias: 'Herd Mentality',
    options: [
      { label: 'Ape in before I miss it', correct: false },
      { label: 'Sit it out — "everyone’s buying" isn’t a reason', correct: true },
    ],
    explain:
      'Crowds usually pile in right at the top. "Everyone’s doing it" is pure FOMO, not a plan. The herd gets rekt together.',
  },
  {
    prompt:
      'Checkout pops "People who bought this also grabbed a $40 case." Your cart was already done. You?',
    bias: 'Social Proof Upsell',
    options: [
      { label: 'Add it, I guess everyone does', correct: false },
      { label: 'Nah, I came here for one thing', correct: true },
    ],
    explain:
      'That "people also bought" line exists to fatten your cart. What random strangers bought has nothing to do with what you need.',
  },
  {
    prompt:
      'A "$129 → $39!!" gadget you never even wanted pops up. You?',
    bias: 'Anchoring Effect',
    options: [
      { label: 'Cop it, that’s like 70% off', correct: false },
      { label: 'Scroll past, didn’t want it at any price', correct: true },
    ],
    explain:
      'The $129 is bait to make $39 feel like a win. A discount on something you don’t want is still 100% wasted money.',
  },
  {
    prompt:
      '40 hours into a game, you lose a ranked match, and a $25 "complete the collection" pack appears. You?',
    bias: 'Sunk Cost Fallacy',
    options: [
      { label: 'Buy it, I’ve already put in so much', correct: false },
      { label: 'Judge the $25 by itself, today', correct: true },
    ],
    explain:
      'Those 40 hours are gone either way. "I already spent so much" is the trap. Only "is $25 worth it right now" matters.',
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
      title: correct ? 'Daily teaser: nailed it' : 'Daily teaser: got got',
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
              Today’s teaser — done
            </h3>
            <p className="text-xs text-zinc-500">
              That’s it for today. Hit reset if you want a fresh one now.
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
            {result ? 'Clean. You saw it coming.' : 'Yeah, they got you.'} The trap: {scenario.bias}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
            {scenario.explain}
          </p>
        </div>
      )}
    </div>
  )
}
