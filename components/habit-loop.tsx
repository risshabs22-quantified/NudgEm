'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Bell,
  Brain,
  Hand,
  Gift,
  ArrowRight,
  Repeat,
  ShieldPlus,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Habit = {
  id: string
  label: string
  cue: string
  craving: string
  response: string
  reward: string
  baseFreq: number // times per week
}

const HABITS: Habit[] = [
  {
    id: 'shopping',
    label: 'Late-night online shopping when bored',
    cue: "It's late, you're bored and scrolling in bed.",
    craving: 'A quick hit of novelty and anticipation.',
    response: 'Open the store app and one-tap checkout.',
    reward: 'The dopamine of an incoming package.',
    baseFreq: 5,
  },
  {
    id: 'ads',
    label: 'Impulse-buying targeted ads while doomscrolling',
    cue: 'Anxious downtime on social media.',
    craving: 'Distraction from the anxiety.',
    response: 'Tap the perfectly-targeted ad and buy.',
    reward: 'A momentary spark of excitement.',
    baseFreq: 6,
  },
  {
    id: 'delivery',
    label: 'Stress-ordering food delivery',
    cue: 'A stressful afternoon at work.',
    craving: 'Comfort and an easy reward.',
    response: 'Order delivery in two taps.',
    reward: 'Instant comfort food at the door.',
    baseFreq: 4,
  },
  {
    id: 'skins',
    label: 'Buying game skins after a loss',
    cue: 'You just lost a competitive match.',
    craving: 'To feel better and signal status.',
    response: 'Buy a skin from the in-game store instantly.',
    reward: 'A dopamine + status hit.',
    baseFreq: 4,
  },
]

type Friction = { id: string; label: string; effect: number }

const FRICTIONS: Friction[] = [
  { id: 'unlink', label: 'Unlink saved credit cards', effect: 0.5 },
  { id: 'logout', label: 'Log out of apps after each use', effect: 0.4 },
  { id: 'oneclick', label: 'Disable one-tap checkout', effect: 0.45 },
  { id: 'wishlist', label: 'Mandatory 24-hour wishlist', effect: 0.55 },
  { id: 'greyscale', label: 'Greyscale phone at night', effect: 0.35 },
]

export function HabitLoop() {
  const { applyOutcome, unlockBadge } = useNudge()
  const [habitId, setHabitId] = React.useState(HABITS[0].id)
  const [friction, setFriction] = React.useState<Friction | null>(null)
  const awarded = React.useRef(false)

  const habit = HABITS.find((h) => h.id === habitId)!

  const apply = (f: Friction) => {
    setFriction(f)
    if (!awarded.current) {
      awarded.current = true
      unlockBadge('habit-hacker')
      applyOutcome({
        kind: 'good',
        rationalityDelta: 3,
        title: 'Rewired a habit loop',
        bias: 'Habit Formation',
        detail: `Inserted friction into a habit loop to slow automatic spending.`,
      })
    }
  }

  const clear = () => setFriction(null)

  const WEEKS = 8
  const data = Array.from({ length: WEEKS + 1 }, (_, w) => {
    const decayed = friction
      ? habit.baseFreq * Math.pow(1 - friction.effect, w * 0.5)
      : habit.baseFreq
    return {
      week: `W${w}`,
      baseline: habit.baseFreq,
      rewired: Math.round(decayed * 10) / 10,
    }
  })
  const endFreq = data[WEEKS].rewired
  const reduction = Math.round((1 - endFreq / habit.baseFreq) * 100)

  const stages = [
    { key: 'cue', label: 'Cue', icon: Bell, text: habit.cue, tone: 'sky' as const },
    { key: 'craving', label: 'Craving', icon: Brain, text: habit.craving, tone: 'violet' as const },
    { key: 'response', label: 'Response', icon: Hand, text: habit.response, tone: 'rose' as const },
    { key: 'reward', label: 'Reward', icon: Gift, text: habit.reward, tone: 'amber' as const },
  ]

  const toneClasses = {
    sky: 'border-sky-500/30 bg-sky-500/5 text-sky-400',
    violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  }

  return (
    <div className="space-y-6">
      {/* Habit picker */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <Repeat className="size-4 text-emerald-400" /> Pick a habit to rewire
        </label>
        <select
          value={habitId}
          onChange={(e) => {
            setHabitId(e.target.value)
            setFriction(null)
          }}
          className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-100 focus:border-emerald-500/50 focus:outline-none"
        >
          {HABITS.map((h) => (
            <option key={h.id} value={h.id} className="bg-zinc-900">
              {h.label}
            </option>
          ))}
        </select>
      </div>

      {/* The loop */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h4 className="text-sm font-semibold text-zinc-100">The habit loop</h4>
        <p className="mt-1 text-xs text-zinc-500">
          Every habit is a 4-part loop. You can&apos;t easily kill the cue or the
          craving — but you can jam friction into the{' '}
          <span className="text-rose-300">Response</span>.
        </p>

        <div className="mt-4 grid items-stretch gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {stages.map((s, i) => {
            const Icon = s.icon
            const isResponse = s.key === 'response'
            return (
              <React.Fragment key={s.key}>
                <div
                  className={cn(
                    'rounded-xl border p-3',
                    toneClasses[s.tone],
                    isResponse && friction && 'ring-2 ring-emerald-500/40',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-300">
                    {isResponse && friction ? (
                      <>
                        <span className="line-through opacity-50">{s.text}</span>
                        <span className="mt-1 block rounded-md bg-emerald-500/15 px-1.5 py-1 text-emerald-200">
                          ⛔ {friction.label} — the loop breaks here.
                        </span>
                      </>
                    ) : (
                      s.text
                    )}
                  </p>
                </div>
                {i < stages.length - 1 && (
                  <div className="hidden items-center justify-center lg:flex">
                    <ArrowRight className="size-4 text-zinc-600" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Friction palette */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <ShieldPlus className="size-4 text-emerald-400" /> Insert a friction point
          </h4>
          <p className="mt-1 text-xs text-zinc-500">
            Tap an intervention to drop it into the Response phase.
          </p>
          <div className="mt-3 space-y-2">
            {FRICTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => apply(f)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all hover:scale-[1.01]',
                  friction?.id === f.id
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-emerald-500/40',
                )}
              >
                <span>{f.label}</span>
                <span className="font-mono text-[11px] text-zinc-500">
                  -{Math.round(f.effect * 100)}%
                </span>
              </button>
            ))}
          </div>
          {friction && (
            <button
              onClick={clear}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300"
            >
              <RotateCcw className="size-3.5" /> Remove friction
            </button>
          )}
        </div>

        {/* Projection */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-100">
              Projected habit frequency
            </h4>
            {friction && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                -{reduction}% in 8 weeks
              </span>
            )}
          </div>
          <div className="mt-3 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,70,58,0.25)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#8a6f5e', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8a6f5e', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#161b22', border: '1px solid #2a313c', borderRadius: 12, color: '#e6edf3', fontSize: 12 }}
                  formatter={(v: number, n) => [`${v}×/wk`, n === 'rewired' ? 'Rewired' : 'Unchanged']}
                />
                <Line type="monotone" dataKey="baseline" stroke="#8a6f5e" strokeWidth={2} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="rewired" stroke="#3fb950" strokeWidth={2.5} dot={{ r: 2, fill: '#3fb950' }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {friction ? (
            <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-emerald-200 nudge-rise">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              By making the Response harder, the automatic loop starves. The cue
              still fires — but without the easy payoff, the behavior fades from{' '}
              {habit.baseFreq}× to ~{endFreq.toFixed(1)}× per week.
            </div>
          ) : (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
              <Sparkles className="size-3.5" /> Add a friction to see the loop
              weaken over time.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
