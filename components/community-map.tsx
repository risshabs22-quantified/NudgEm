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
import { Users, Flame, TrendingUp, Info } from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

// Seeded "community" baseline so the herd map is populated for every visitor.
const SEED: Record<string, { fell: number; avoided: number }> = {
  'Default Bias': { fell: 812, avoided: 203 },
  'Herd Mentality / FOMO': { fell: 774, avoided: 226 },
  'Framing Effect': { fell: 741, avoided: 289 },
  'Scarcity Mindset': { fell: 712, avoided: 301 },
  'Anchoring Effect': { fell: 681, avoided: 332 },
  'Loss Aversion': { fell: 663, avoided: 358 },
  'Sunk Cost Fallacy': { fell: 628, avoided: 372 },
  'Hyperbolic Discounting': { fell: 583, avoided: 421 },
}

export function CommunityMap() {
  const { trapStats } = useNudge()

  const combined = React.useMemo(() => {
    const map: Record<string, { fell: number; avoided: number }> = {}
    for (const [k, v] of Object.entries(SEED)) map[k] = { ...v }
    for (const [k, v] of Object.entries(trapStats)) {
      const cur = map[k] ?? { fell: 0, avoided: 0 }
      map[k] = { fell: cur.fell + v.fell, avoided: cur.avoided + v.avoided }
    }
    return Object.entries(map)
      .map(([bias, v]) => {
        const total = v.fell + v.avoided
        return {
          bias,
          pct: total ? Math.round((v.fell / total) * 100) : 0,
          total,
          mine: trapStats[bias]?.fell ?? 0,
        }
      })
      .sort((a, b) => b.pct - a.pct)
  }, [trapStats])

  const visitors = combined.reduce((s, c) => s + c.total, 0)
  const top = combined[0]
  const myContributions = Object.values(trapStats).reduce(
    (s, v) => s + v.fell + v.avoided,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="size-4" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Decisions tracked
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">
            {visitors.toLocaleString()}
          </p>
          <p className="text-[11px] text-zinc-500">across the NudgeEm community</p>
        </div>
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="flex items-center gap-2 text-rose-300">
            <Flame className="size-4" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Most-fallen-for trap
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-rose-400">
            {top.pct}%
          </p>
          <p className="text-[11px] text-zinc-500">{top.bias}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <TrendingUp className="size-4" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Your contributions
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-400">
            {myContributions}
          </p>
          <p className="text-[11px] text-zinc-500">decisions you added live</p>
        </div>
      </div>

      {/* Herd callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-amber-400" />
        <p className="text-sm leading-relaxed text-zinc-300">
          <span className="font-semibold text-amber-300">
            {top.pct}% of NudgeEm visitors fell for {top.bias}.
          </span>{' '}
          Feel the pull to assume that&apos;s just "normal"? That reflex —
          treating the crowd&apos;s behavior as proof — is exactly{' '}
          <span className="font-semibold">Social Proof &amp; Herd Mentality</span>.
          The majority being wrong doesn&apos;t make it right.
        </p>
      </div>

      {/* The map */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h4 className="text-sm font-semibold text-zinc-100">
          % of people who fell for each trap
        </h4>
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={combined}
              layout="vertical"
              margin={{ top: 0, right: 44, left: 10, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="bias"
                width={150}
                tick={{ fill: '#8b949e', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="pct" radius={[0, 8, 8, 0]} barSize={22}>
                {combined.map((d, i) => (
                  <Cell
                    key={d.bias}
                    fill={i === 0 ? '#e57a66' : d.pct >= 65 ? '#d29922' : '#7bb2c0'}
                  />
                ))}
                <LabelList
                  dataKey="pct"
                  position="right"
                  formatter={(v: number) => `${v}%`}
                  fill="#e3d3c2"
                  fontSize={12}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          This heat map blends a seeded community baseline with{' '}
          <span className="font-semibold text-emerald-300">your own</span> live
          choices from every simulator. The more traps you avoid, the more you
          pull these bars down.
        </p>
      </div>
    </div>
  )
}
