'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  HeartPulse,
  Leaf,
  PiggyBank,
  Landmark,
  Target,
  Megaphone,
  ToggleRight,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

type OrganPolicy = 'optIn' | 'optOut'

// Baselines with zero nudges applied.
const BASE = {
  donor: 15,
  savings: 6,
  carbonCut: 0,
  healthcare: 52,
}

const TARGETS = {
  donor: 80,
  savings: 12,
  carbonCut: 30,
  healthcare: 75,
}

export function PolicySandbox() {
  const { logInfo, resistTrap, unlockBadge } = useNudge()
  const [organ, setOrgan] = React.useState<OrganPolicy>('optIn')
  const [bagFee, setBagFee] = React.useState(0) // dollars, 0–0.25
  const [greenEnergy, setGreenEnergy] = React.useState(false)
  const [saveMore, setSaveMore] = React.useState(0) // % of workforce auto-enrolled
  const [submitted, setSubmitted] = React.useState(false)

  const kpi = React.useMemo(() => {
    const donor = organ === 'optOut' ? 99 : 15
    const savings = +(BASE.savings + (saveMore / 100) * 8).toFixed(1)
    const bagReduction = Math.min(85, bagFee * 600) // $0.10 -> 60%, $0.14 -> 84%
    const carbonCut = Math.round((greenEnergy ? 25 : 0) + bagReduction * 0.1)
    const healthcare = Math.round(
      clamp(45 + donor * 0.45 + (greenEnergy ? 5 : 0), 0, 100),
    )
    return { donor, savings, carbonCut, healthcare }
  }, [organ, bagFee, greenEnergy, saveMore])

  const progress = {
    donor: clamp((kpi.donor / TARGETS.donor) * 100, 0, 100),
    savings: clamp((kpi.savings / TARGETS.savings) * 100, 0, 100),
    carbonCut: clamp((kpi.carbonCut / TARGETS.carbonCut) * 100, 0, 100),
    healthcare: clamp((kpi.healthcare / TARGETS.healthcare) * 100, 0, 100),
  }
  const targetsHit =
    Number(kpi.donor >= TARGETS.donor) +
    Number(kpi.savings >= TARGETS.savings) +
    Number(kpi.carbonCut >= TARGETS.carbonCut) +
    Number(kpi.healthcare >= TARGETS.healthcare)

  const effectiveness = Math.round(
    (progress.donor + progress.savings + progress.carbonCut + progress.healthcare) /
      4,
  )

  const chartData = [
    { name: 'Donations', baseline: BASE.donor, nudged: kpi.donor },
    { name: 'Savings', baseline: BASE.savings, nudged: kpi.savings },
    { name: 'Carbon Cut', baseline: BASE.carbonCut, nudged: kpi.carbonCut },
    { name: 'Healthcare', baseline: BASE.healthcare, nudged: kpi.healthcare },
  ]

  const brief = () => {
    setSubmitted(true)
    if (targetsHit >= 3) {
      resistTrap({
        rationalityGain: 4,
        title: `Cabinet brief: ${targetsHit}/4 national targets hit`,
        bias: 'Choice Architecture',
        detail: `Hit national goals using nudges alone — ${effectiveness}% effectiveness, zero mandates.`,
      })
      unlockBadge('policy-whisperer')
    } else {
      logInfo({
        title: `Cabinet brief: ${targetsHit}/4 targets hit`,
        bias: 'Choice Architecture',
        detail: `Policy effectiveness ${effectiveness}%. Try opt-out defaults for the biggest swings.`,
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Policy controls */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-2">
            <Landmark className="size-4 text-sky-400" />
            <h4 className="text-sm font-semibold text-zinc-100">
              Your policy levers
            </h4>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            You're a government economic advisor. No bans, no mandates — only
            nudges. Change a default and watch a nation move.
          </p>

          {/* Organ donation */}
          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="size-4 text-rose-400" />
              <span className="text-sm font-medium text-zinc-200">
                Organ Donation Default
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(['optIn', 'optOut'] as OrganPolicy[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setOrgan(p)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                    organ === p
                      ? p === 'optOut'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:text-zinc-200',
                  )}
                >
                  {p === 'optIn' ? 'Opt-In (check a box)' : 'Opt-Out (default yes)'}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              {organ === 'optOut'
                ? 'Default Bias works FOR you — donor rates jump to ~99%.'
                : 'Default Bias works against you — most people never opt in (~15%).'}
            </p>
          </div>

          {/* Bag fee */}
          <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <ShoppingBag className="size-4 text-emerald-400" />
                Plastic Bag Default Fee
              </span>
              <span className="font-mono text-sm font-semibold text-zinc-100">
                ${bagFee.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.25}
              step={0.01}
              value={bagFee}
              onChange={(e) => setBagFee(Number(e.target.value))}
              className="nudge-range mt-3 w-full"
              aria-label="Plastic bag fee"
            />
            <p className="mt-2 text-[11px] text-zinc-500">
              A tiny default charge (the famous $0.05–$0.10) cuts bag use by 60%+
              — loss aversion beats any poster.
            </p>
          </div>

          {/* Green energy default */}
          <button
            onClick={() => setGreenEnergy((v) => !v)}
            className={cn(
              'mt-3 flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all',
              greenEnergy
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-zinc-700 bg-zinc-800/30',
            )}
          >
            <span className="flex items-center gap-2">
              <Zap
                className={cn(
                  'size-4',
                  greenEnergy ? 'text-emerald-400' : 'text-zinc-500',
                )}
              />
              <span>
                <span className="block text-sm font-medium text-zinc-200">
                  Renewable Energy by Default
                </span>
                <span className="block text-[11px] text-zinc-500">
                  Households auto-enrolled in green tariffs (can opt out)
                </span>
              </span>
            </span>
            <Toggle on={greenEnergy} />
          </button>

          {/* Save More Tomorrow */}
          <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <PiggyBank className="size-4 text-emerald-400" />
                "Save More Tomorrow" Enrollment
              </span>
              <span className="font-mono text-sm font-semibold text-zinc-100">
                {saveMore}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={saveMore}
              onChange={(e) => setSaveMore(Number(e.target.value))}
              className="nudge-range mt-3 w-full"
              aria-label="Save More Tomorrow enrollment"
            />
            <p className="mt-2 text-[11px] text-zinc-500">
              Auto-escalate savings from future raises. People never feel the
              cut, so enrollment sticks and the savings rate climbs.
            </p>
          </div>
        </div>

        {/* Effectiveness + brief */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Target className="size-4 text-emerald-400" /> Nudge Effectiveness
            </span>
            <span
              className={cn(
                'font-mono text-lg font-bold',
                effectiveness >= 75
                  ? 'text-emerald-400'
                  : effectiveness >= 45
                    ? 'text-amber-400'
                    : 'text-rose-400',
              )}
            >
              {effectiveness}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${effectiveness}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            {targetsHit}/4 national targets met with zero mandates.
          </p>
          <button
            onClick={brief}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-all"
          >
            <Megaphone className="size-4" /> Brief the Cabinet
          </button>
          {submitted && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-300 nudge-rise">
              <CheckCircle2 className="size-3.5" /> Logged to your decision ledger.
            </p>
          )}
        </div>
      </div>

      {/* Outcomes */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h4 className="text-sm font-semibold text-zinc-100">
            National impact: baseline vs your nudges
          </h4>
          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barGap={4}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(92,70,58,0.25)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8b949e', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#6e7681', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(58,44,36,0.25)' }}
                  contentStyle={{
                    background: '#161b22',
                    border: '1px solid #2a313c',
                    borderRadius: 12,
                    color: '#e6edf3',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="baseline"
                  name="Baseline"
                  fill="#484f58"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
                <Bar
                  dataKey="nudged"
                  name="Your policy"
                  fill="#3fb950"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            icon={HeartPulse}
            label="Organ Donors"
            value={`${kpi.donor}%`}
            target={`target ${TARGETS.donor}%`}
            pct={progress.donor}
            tone="rose"
          />
          <KpiCard
            icon={PiggyBank}
            label="Savings Rate"
            value={`${kpi.savings}%`}
            target={`target ${TARGETS.savings}%`}
            pct={progress.savings}
            tone="emerald"
          />
          <KpiCard
            icon={Leaf}
            label="Carbon Cut"
            value={`${kpi.carbonCut}%`}
            target={`target ${TARGETS.carbonCut}%`}
            pct={progress.carbonCut}
            tone="emerald"
          />
          <KpiCard
            icon={HeartPulse}
            label="Healthcare Eff."
            value={`${kpi.healthcare}%`}
            target={`target ${TARGETS.healthcare}%`}
            pct={progress.healthcare}
            tone="sky"
          />
        </div>

        <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-xs leading-relaxed text-zinc-400">
          Notice the single biggest jump comes from flipping organ donation to{' '}
          <span className="font-semibold text-emerald-300">opt-out</span>. No one
          is forced — the <span className="font-semibold">default</span> simply
          changed. That's the entire thesis of nudge policy: same freedom,
          radically different outcomes.
        </p>
      </div>
    </div>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-emerald-500' : 'bg-zinc-700',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white transition-all',
          on ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </span>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  target,
  pct,
  tone,
}: {
  icon: typeof HeartPulse
  label: string
  value: string
  target: string
  pct: number
  tone: 'rose' | 'emerald' | 'sky'
}) {
  const toneText =
    tone === 'rose'
      ? 'text-rose-400'
      : tone === 'sky'
        ? 'text-sky-400'
        : 'text-emerald-400'
  const toneBar =
    tone === 'rose'
      ? 'bg-rose-400'
      : tone === 'sky'
        ? 'bg-sky-400'
        : 'bg-emerald-400'
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <Icon className={cn('size-3.5', toneText)} />
      </div>
      <p className={cn('mt-1 font-mono text-xl font-bold', toneText)}>{value}</p>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn('h-full rounded-full transition-all duration-500', toneBar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-zinc-500">{target}</p>
    </div>
  )
}
