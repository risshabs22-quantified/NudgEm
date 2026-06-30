'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from 'recharts'
import { Shield, Skull, SplitSquareHorizontal, Lightbulb, RotateCcw } from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

/**
 * The classic Tversky & Kahneman "Asian disease" framing problem, ported to
 * money. Both options describe the EXACT same outcome of a $600 pool — one as a
 * gain, one as a loss. ~72% of people pick the gain frame.
 */

const POOL = 600
const KEEP = 200 // gain frame
const LOSE = POOL - KEEP // 400 loss frame

type Pick = 'gain' | 'loss' | null

export function FramingTest() {
  const { logInfo, resistTrap } = useNudge()
  const [pick, setPick] = React.useState<Pick>(null)

  const choose = (p: Exclude<Pick, null>) => {
    setPick(p)
    if (p === 'gain') {
      logInfo({
        title: 'Chose the "gain" frame',
        bias: 'Framing Effect',
        detail:
          'You picked "Keep $200" over the mathematically identical "Lose $400" — like ~72% of people. Loss Aversion at work.',
      })
    } else {
      // Choosing the loss frame here means you saw through the wording.
      resistTrap({
        rationalityGain: 5,
        title: 'Saw through the loss frame',
        bias: 'Framing Effect',
        detail:
          'You recognized both options are identical and resisted the pull of the gain wording.',
      })
    }
  }

  const data = [
    { name: 'Keep $200\n(gain frame)', value: 72, key: 'gain' },
    { name: 'Lose $400\n(loss frame)', value: 28, key: 'loss' },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* The choice */}
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">The setup:</span> You're
          handed <span className="font-mono text-emerald-400">${POOL}</span>. Choose
          how it's described to you — the money outcome is{' '}
          <span className="font-semibold text-zinc-100">exactly the same</span>{' '}
          either way.
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Gain frame */}
          <button
            onClick={() => choose('gain')}
            className={cn(
              'group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:scale-[1.02]',
              pick === 'gain'
                ? 'border-emerald-500/60 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                : 'border-zinc-700 bg-zinc-900/60 hover:border-emerald-500/40',
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Shield className="size-5" />
            </span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Option A · Gain frame
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-zinc-50">
              "Keep ${KEEP} of your ${POOL}."
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Sounds like a win — you're holding onto something.
            </p>
            {pick === 'gain' && (
              <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                You chose this
              </span>
            )}
          </button>

          {/* Loss frame */}
          <button
            onClick={() => choose('loss')}
            className={cn(
              'group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:scale-[1.02]',
              pick === 'loss'
                ? 'border-rose-500/60 bg-rose-500/10 ring-2 ring-rose-500/30'
                : 'border-zinc-700 bg-zinc-900/60 hover:border-rose-500/40',
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
              <Skull className="size-5" />
            </span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Option B · Loss frame
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-zinc-50">
              "Lose ${LOSE} of your ${POOL}."
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Sounds painful — yet you end with the same ${KEEP}.
            </p>
            {pick === 'loss' && (
              <span className="absolute right-3 top-3 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                You chose this
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-center text-xs text-zinc-400">
          <SplitSquareHorizontal className="size-4 text-sky-400" />
          Both options leave you with exactly{' '}
          <span className="font-mono font-semibold text-zinc-100">
            ${KEEP}
          </span>
          . Identical math, different feeling.
        </div>
      </div>

      {/* The reveal */}
      <div
        className={cn(
          'flex flex-col rounded-2xl border p-5 transition-all',
          pick
            ? 'border-sky-500/40 bg-sky-500/5'
            : 'border-zinc-800 bg-zinc-900/40',
        )}
      >
        {!pick ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <SplitSquareHorizontal className="size-8 text-zinc-700" />
            <p className="mt-3 text-sm font-medium text-zinc-400">
              Pick a frame to reveal the data
            </p>
            <p className="mt-1 max-w-xs text-xs text-zinc-600">
              We'll show how the rest of humanity chooses — and why.
            </p>
          </div>
        ) : (
          <div className="nudge-rise flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                <Lightbulb className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                  Framing Effect · Loss Aversion
                </p>
                <p className="text-sm font-semibold text-zinc-100">
                  How humans actually choose
                </p>
              </div>
            </div>

            <div className="mt-4 h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={26}>
                    {data.map((d) => (
                      <Cell
                        key={d.key}
                        fill={d.key === 'gain' ? '#10b981' : '#f43f5e'}
                        opacity={pick === d.key ? 1 : 0.55}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => `${v}%`}
                      fill="#e4e4e7"
                      fontSize={12}
                      fontWeight={700}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              In Tversky & Kahneman's research, about{' '}
              <span className="font-semibold text-emerald-300">72%</span> chose the
              gain frame even though both outcomes are identical.{' '}
              {pick === 'gain' ? (
                <>
                  You went with the crowd — the word{' '}
                  <span className="font-semibold text-emerald-300">"keep"</span>{' '}
                  felt safer than <span className="font-semibold">"lose"</span>.
                  That instinct is <span className="font-semibold">Loss Aversion</span>.
                </>
              ) : (
                <>
                  You picked the loss frame — meaning you likely saw past the
                  wording to the identical math.{' '}
                  <span className="font-semibold text-sky-300">
                    That's exactly the skill NudgeEm trains.
                  </span>
                </>
              )}
            </p>

            <button
              onClick={() => setPick(null)}
              className="mt-4 flex w-fit items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
            >
              <RotateCcw className="size-3.5" /> Reset test
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
