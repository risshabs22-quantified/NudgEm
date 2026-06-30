'use client'

import * as React from 'react'
import {
  Radar,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Sparkles,
  ShieldQuestion,
} from 'lucide-react'
import { SpiderChart, type RadarAxis } from '@/components/spider-chart'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type AxisKey = 'risk' | 'present' | 'fatigue' | 'scarcity' | 'statusquo'

const AXES: { key: AxisKey; label: string; short: string }[] = [
  { key: 'risk', label: 'Risk Aversion', short: 'Risk Aversion' },
  { key: 'present', label: 'Present Bias', short: 'Present Bias' },
  { key: 'fatigue', label: 'Choice Fatigue', short: 'Choice Fatigue' },
  { key: 'scarcity', label: 'Susceptibility to Scarcity', short: 'Scarcity Pull' },
  { key: 'statusquo', label: 'Status Quo Bias', short: 'Status Quo' },
]

type Question = {
  axis: AxisKey
  prompt: string
  options: { label: string; score: number }[]
}

const QUESTIONS: Question[] = [
  {
    axis: 'risk',
    prompt: 'A guaranteed $50, or a coin-flip for $120?',
    options: [
      { label: 'Take the guaranteed $50', score: 85 },
      { label: 'Depends on my mood', score: 50 },
      { label: 'Flip the coin for $120', score: 18 },
    ],
  },
  {
    axis: 'risk',
    prompt: 'Your investment suddenly drops 20%. You…',
    options: [
      { label: 'Sell to stop the bleeding', score: 85 },
      { label: 'Do nothing and wait', score: 42 },
      { label: 'Buy more at a discount', score: 15 },
    ],
  },
  {
    axis: 'present',
    prompt: '$100 right now, or $130 in twelve months?',
    options: [
      { label: 'Give me the $100 today', score: 85 },
      { label: 'Tough call', score: 50 },
      { label: 'Wait for the $130', score: 15 },
    ],
  },
  {
    axis: 'present',
    prompt: 'Free evening, a project due next month. You…',
    options: [
      { label: 'Start the new series — relax now', score: 80 },
      { label: 'A little of both', score: 48 },
      { label: 'Get ahead on the project', score: 18 },
    ],
  },
  {
    axis: 'fatigue',
    prompt: '600 titles on the streaming app. You…',
    options: [
      { label: 'Scroll 30 min, then rewatch something old', score: 85 },
      { label: 'Pick the first decent option', score: 40 },
      { label: 'I had a shortlist ready', score: 15 },
    ],
  },
  {
    axis: 'fatigue',
    prompt: 'A 12-page restaurant menu lands in your hands.',
    options: [
      { label: 'Overwhelmed — I order my usual', score: 75 },
      { label: 'Take a while, but I choose', score: 45 },
      { label: 'Decide quickly and move on', score: 15 },
    ],
  },
  {
    axis: 'scarcity',
    prompt: '"Only 2 left — sale ends in 5 minutes!" You…',
    options: [
      { label: 'Buy now to be safe', score: 88 },
      { label: 'Feel the pull, but pause', score: 45 },
      { label: 'Ignore it entirely', score: 12 },
    ],
  },
  {
    axis: 'scarcity',
    prompt: 'A limited-edition drop everyone is hyping.',
    options: [
      { label: 'Cop it immediately', score: 82 },
      { label: 'Consider it for a bit', score: 45 },
      { label: 'Not interested', score: 15 },
    ],
  },
  {
    axis: 'statusquo',
    prompt: 'A subscription auto-renews next week. You…',
    options: [
      { label: 'Leave it — too much hassle to cancel', score: 85 },
      { label: 'Mean to check, probably won’t', score: 55 },
      { label: 'Already reviewed & cancelled extras', score: 15 },
    ],
  },
  {
    axis: 'statusquo',
    prompt: 'A better phone plan saves $15/mo — but you must switch.',
    options: [
      { label: 'Stay put, not worth the effort', score: 80 },
      { label: 'Keep meaning to switch', score: 50 },
      { label: 'Switch right away', score: 15 },
    ],
  },
]

function archetypeFor(scores: Record<AxisKey, number>) {
  const top = (Object.entries(scores) as [AxisKey, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0]
  const map: Record<AxisKey, { name: string; blurb: string }> = {
    risk: {
      name: 'The Safety-Seeker',
      blurb:
        'Losses hit you harder than wins feel good. Good for avoiding disasters — but you might play it too safe and miss upside.',
    },
    present: {
      name: 'The Now-ist',
      blurb:
        'Present-you wins most fights with future-you. Auto-save on payday before you can touch it.',
    },
    fatigue: {
      name: 'The Overwhelmed Optimizer',
      blurb:
        'Too many options and your brain taps out. Pick criteria first, grab the first thing that clears the bar, move on.',
    },
    scarcity: {
      name: 'The FOMO-Prone',
      blurb:
        '"Only 2 left" and countdown timers get you. Treat urgency like a scam and wait 24 hours.',
    },
    statusquo: {
      name: 'The Default-Dweller',
      blurb:
        "You stick with whatever's already set. Audit your auto-renewals every few months — inertia is quietly costing you.",
    },
  }
  return { key: top[0], ...map[top[0]] }
}

export function BiasRadar() {
  const { applyOutcome, unlockBadge } = useNudge()
  const [step, setStep] = React.useState(0) // 0..9 questions, then results
  const [answers, setAnswers] = React.useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  )
  const [finished, setFinished] = React.useState(false)
  const loggedRef = React.useRef(false)

  const scores = React.useMemo(() => {
    const acc: Record<AxisKey, { sum: number; count: number }> = {
      risk: { sum: 0, count: 0 },
      present: { sum: 0, count: 0 },
      fatigue: { sum: 0, count: 0 },
      scarcity: { sum: 0, count: 0 },
      statusquo: { sum: 0, count: 0 },
    }
    QUESTIONS.forEach((q, i) => {
      const a = answers[i]
      if (a !== null) {
        acc[q.axis].sum += q.options[a].score
        acc[q.axis].count += 1
      }
    })
    const out = {} as Record<AxisKey, number>
    ;(Object.keys(acc) as AxisKey[]).forEach((k) => {
      out[k] = acc[k].count ? Math.round(acc[k].sum / acc[k].count) : 0
    })
    return out
  }, [answers])

  const radarData: RadarAxis[] = AXES.map((a) => ({
    axis: a.label,
    short: a.short,
    value: scores[a.key],
  }))

  const overall = Math.round(
    AXES.reduce((s, a) => s + scores[a.key], 0) / AXES.length,
  )
  const archetype = archetypeFor(scores)

  const answer = (optIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = optIndex
      return next
    })
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setFinished(true)
    }
  }

  // Log the completed assessment once.
  React.useEffect(() => {
    if (finished && !loggedRef.current) {
      loggedRef.current = true
      applyOutcome({
        kind: 'good',
        rationalityDelta: 2,
        title: `Bias profile mapped: ${archetype.name}`,
        bias: 'Self-Awareness',
        detail: `Overall susceptibility ${overall}/100. Knowing your weak spots is step one.`,
      })
      unlockBadge('self-aware')
    }
  }, [finished, applyOutcome, archetype.name, overall])

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setStep(0)
    setFinished(false)
    loggedRef.current = false
  }

  const download = () => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const rows = AXES.map(
      (a) =>
        `<tr><td>${a.label}</td><td style="text-align:right;font-family:monospace;color:#3fb950">${scores[a.key]}/100</td></tr>`,
    ).join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>NudgeEm Behavioral Profile</title>
<style>
body{background:#0d1117;color:#cdd9e5;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:40px auto;padding:0 24px;line-height:1.6}
h1{font-size:28px;margin:0}
.tag{display:inline-block;background:rgba(63,185,80,.12);color:#3fb950;border:1px solid rgba(63,185,80,.3);padding:4px 12px;border-radius:999px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.card{background:#161b22;border:1px solid #21262d;border-radius:16px;padding:24px;margin-top:24px}
table{width:100%;border-collapse:collapse}
td{padding:10px 0;border-bottom:1px solid #21262d;font-size:15px}
.big{font-size:40px;font-weight:800;color:#3fb950;margin:8px 0}
.muted{color:#8b949e;font-size:13px}
.foot{margin-top:32px;color:#484f58;font-size:12px;text-align:center}
@media print{body{background:#fff;color:#000}}
</style></head><body>
<span class="tag">NudgeEm · Behavioral Profile Résumé</span>
<h1>${archetype.name}</h1>
<p class="muted">Generated ${date}</p>
<div class="card">
<p class="muted">Overall susceptibility to nudges</p>
<div class="big">${overall}/100</div>
<p>${archetype.blurb}</p>
</div>
<div class="card">
<h3 style="margin-top:0">Bias breakdown</h3>
<table>${rows}</table>
</div>
<p class="foot">Higher numbers = stronger pull toward that bias. Just for learning — not financial advice.</p>
</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'NudgeEm-Behavioral-Profile.html'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  /* ----------------------------- Quiz ------------------------------ */
  if (!finished) {
    const q = QUESTIONS[step]
    const axisLabel = AXES.find((a) => a.key === q.axis)!.label
    const progress = ((step + (answers[step] !== null ? 1 : 0)) / QUESTIONS.length) * 100
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              <ShieldQuestion className="size-3.5" />
              {axisLabel}
            </span>
            <span className="font-mono text-xs text-zinc-500">
              {step + 1} / {QUESTIONS.length}
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h3 className="mt-5 font-serif text-xl font-semibold text-zinc-50">
            {q.prompt}
          </h3>

          <div className="mt-4 space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(i)}
                className={cn(
                  'group flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all',
                  answers[step] === i
                    ? 'border-violet-500/50 bg-violet-500/10 text-zinc-50'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-violet-500/40 hover:text-zinc-100',
                )}
              >
                {opt.label}
                <ArrowRight className="size-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-400" />
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300"
            >
              <ArrowLeft className="size-3.5" /> Previous
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ---------------------------- Results ---------------------------- */
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Radar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-2">
          <Radar className="size-4 text-violet-400" />
          <h4 className="text-sm font-semibold text-zinc-100">
            Your Behavioral Radar
          </h4>
        </div>
        <div className="mx-auto mt-2 max-w-sm">
          <SpiderChart data={radarData} accent="#bc8cff" />
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-zinc-900 p-5 nudge-rise">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
            <Sparkles className="size-3" /> Your archetype
          </span>
          <h3 className="mt-3 font-serif text-2xl font-semibold text-zinc-50">
            {archetype.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-violet-400">
              {overall}
            </span>
            <span className="text-xs text-zinc-500">/100 overall susceptibility</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            {archetype.blurb}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Axis breakdown
          </h5>
          <div className="mt-3 space-y-2.5">
            {AXES.map((a) => (
              <div key={a.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">{a.label}</span>
                  <span className="font-mono text-zinc-400">
                    {scores[a.key]}/100
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-500"
                    style={{ width: `${scores[a.key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={download}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-bold text-white transition-all"
          >
            <Download className="size-4" /> Download profile
          </button>
          <button
            onClick={restart}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <RotateCcw className="size-4" /> Retake
          </button>
        </div>
      </div>
    </div>
  )
}
