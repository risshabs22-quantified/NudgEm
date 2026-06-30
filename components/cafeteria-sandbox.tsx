'use client'

import * as React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import {
  Play,
  RotateCcw,
  Salad,
  Target,
  Users,
  CheckCircle2,
  Eye,
  EyeOff,
  Wand2,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Zone = 'front' | 'mid' | 'back'
type Item = {
  id: string
  name: string
  emoji: string
  healthy: boolean
  appeal: number // intrinsic desirability
  zone: Zone
}

const ZONE_SALIENCE: Record<Zone, number> = { front: 1, mid: 0.55, back: 0.28 }
const ZONE_LABEL: Record<Zone, string> = {
  front: 'Eye level / front',
  mid: 'Middle of line',
  back: 'Back / hidden',
}

// "Baseline" = the typical junk-forward cafeteria, used as the comparison point.
const BASELINE: Record<string, Zone> = {
  fries: 'front',
  soda: 'front',
  pizza: 'mid',
  salad: 'back',
  fruit: 'back',
  water: 'mid',
}

const INITIAL: Item[] = [
  { id: 'salad', name: 'Garden Salad', emoji: '🥗', healthy: true, appeal: 0.8, zone: 'back' },
  { id: 'fruit', name: 'Fruit Cup', emoji: '🍓', healthy: true, appeal: 0.85, zone: 'back' },
  { id: 'water', name: 'Water', emoji: '💧', healthy: true, appeal: 0.7, zone: 'mid' },
  { id: 'fries', name: 'Fries', emoji: '🍟', healthy: false, appeal: 1.35, zone: 'front' },
  { id: 'soda', name: 'Soda', emoji: '🥤', healthy: false, appeal: 1.25, zone: 'front' },
  { id: 'pizza', name: 'Pizza Slice', emoji: '🍕', healthy: false, appeal: 1.3, zone: 'mid' },
]

function shares(items: Item[], zoneOf: (it: Item) => Zone) {
  const weights = items.map((it) => it.appeal * ZONE_SALIENCE[zoneOf(it)])
  const total = weights.reduce((a, b) => a + b, 0) || 1
  return items.map((it, i) => ({ item: it, share: weights[i] / total }))
}

function healthyPct(items: Item[], zoneOf: (it: Item) => Zone) {
  return shares(items, zoneOf)
    .filter((s) => s.item.healthy)
    .reduce((a, s) => a + s.share, 0)
}

export function CafeteriaSandbox() {
  const { applyOutcome, unlockBadge } = useNudge()
  const [items, setItems] = React.useState<Item[]>(INITIAL)
  const [counts, setCounts] = React.useState<Record<string, number>>({})
  const [served, setServed] = React.useState(0)
  const [running, setRunning] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const awarded = React.useRef(false)

  React.useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const baselineHealthy = healthyPct(INITIAL, (it) => BASELINE[it.id])
  const currentHealthy = healthyPct(items, (it) => it.zone)
  const improvement = ((currentHealthy - baselineHealthy) / baselineHealthy) * 100
  const goalMet = improvement >= 40

  const setZone = (id: string, zone: Zone) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, zone } : it)))
    setDone(false)
  }

  const optimize = () => {
    setItems((prev) =>
      prev.map((it) => ({ ...it, zone: it.healthy ? 'front' : 'back' })),
    )
    setDone(false)
  }

  const reset = () => {
    if (timer.current) clearInterval(timer.current)
    setItems(INITIAL)
    setCounts({})
    setServed(0)
    setRunning(false)
    setDone(false)
    awarded.current = false
  }

  const run = () => {
    if (timer.current) clearInterval(timer.current)
    setCounts({})
    setServed(0)
    setDone(false)
    setRunning(true)
    const dist = shares(items, (it) => it.zone)
    const TOTAL = 60
    let n = 0
    const local: Record<string, number> = {}
    timer.current = setInterval(() => {
      // 3 diners per tick
      for (let k = 0; k < 3; k++) {
        const r = Math.random()
        let acc = 0
        for (const d of dist) {
          acc += d.share
          if (r <= acc) {
            local[d.item.id] = (local[d.item.id] ?? 0) + 1
            break
          }
        }
        n++
      }
      setCounts({ ...local })
      setServed(n)
      if (n >= TOTAL) {
        if (timer.current) clearInterval(timer.current)
        setRunning(false)
        setDone(true)
        if (goalMet && !awarded.current) {
          awarded.current = true
          unlockBadge('architect-of-good')
          applyOutcome({
            kind: 'good',
            rationalityDelta: 4,
            title: 'Cafeteria redesigned for good',
            bias: 'Salience Bias',
            detail: `Lifted healthy choices ${Math.round(
              improvement,
            )}% just by moving food to eye level — no bans needed.`,
          })
        }
      }
    }, 120)
  }

  const chartData = items.map((it) => ({
    name: it.emoji,
    label: it.name,
    count: counts[it.id] ?? 0,
    healthy: it.healthy,
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Arrangement */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Salad className="size-4 text-emerald-400" /> Arrange the line
          </h4>
          <button
            onClick={optimize}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20"
          >
            <Wand2 className="size-3.5" /> Auto-optimize
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Place each item. Salience Bias means whatever sits at eye level gets
          eaten — no food is ever banned.
        </p>

        <div className="mt-4 space-y-2.5">
          {items.map((it) => (
            <div
              key={it.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-2.5',
                it.healthy
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-rose-500/20 bg-rose-500/5',
              )}
            >
              <span className="text-2xl">{it.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100">{it.name}</p>
                <p
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wider',
                    it.healthy ? 'text-emerald-400' : 'text-rose-400',
                  )}
                >
                  {it.healthy ? 'Healthy' : 'Junk'}
                </p>
              </div>
              <div className="flex gap-1">
                {(['front', 'mid', 'back'] as Zone[]).map((z) => (
                  <button
                    key={z}
                    onClick={() => setZone(it.id, z)}
                    title={ZONE_LABEL[z]}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg border text-[10px] transition-all',
                      it.zone === z
                        ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                        : 'border-zinc-700 bg-zinc-800/40 text-zinc-500 hover:text-zinc-300',
                    )}
                  >
                    {z === 'front' ? <Eye className="size-3.5" /> : z === 'back' ? <EyeOff className="size-3.5" /> : '•'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={run}
            disabled={running}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-all disabled:opacity-60"
          >
            <Play className="size-4" /> {running ? 'Diners choosing…' : 'Run Nudge Simulation'}
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <Target className="size-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Healthy choice share
              </span>
            </div>
            <p className="mt-2 font-mono text-3xl font-bold text-emerald-400">
              {Math.round(currentHealthy * 100)}%
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              baseline {Math.round(baselineHealthy * 100)}%
            </p>
          </div>
          <div
            className={cn(
              'rounded-2xl border p-4',
              goalMet
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-zinc-800 bg-zinc-900',
            )}
          >
            <div className="flex items-center gap-2 text-zinc-300">
              <Users className="size-4" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                vs baseline
              </span>
            </div>
            <p
              className={cn(
                'mt-2 font-mono text-3xl font-bold',
                improvement >= 0 ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {improvement >= 0 ? '+' : ''}
              {Math.round(improvement)}%
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">goal: +40%</p>
          </div>
        </div>

        {goalMet && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200 nudge-rise">
            <CheckCircle2 className="size-4 shrink-0" />
            Goal reached — you boosted healthy eating 40%+ without banning a
            single fry. That's choice architecture.
          </div>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-zinc-100">
              What {served} diners chose
            </h4>
            <span className="font-mono text-xs text-zinc-500">{served}/60</span>
          </div>
          <div className="mt-3 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,70,58,0.25)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 16 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6e7681', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(58,44,36,0.3)' }}
                  contentStyle={{ background: '#161b22', border: '1px solid #2a313c', borderRadius: 12, color: '#e6edf3', fontSize: 12 }}
                  formatter={(v: number, _n, p) => [`${v} diners`, (p?.payload as { label: string }).label]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={42}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.healthy ? '#3fb950' : '#f85149'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
