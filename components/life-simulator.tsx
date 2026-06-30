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
  Legend,
} from 'recharts'
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  TrendingUp,
  Wallet,
  PiggyBank,
  Brain,
  Hourglass,
  PartyPopper,
  Wrench,
  Flame,
  Home,
  LineChart as LineChartIcon,
  Trophy,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Config                                                            */
/* ------------------------------------------------------------------ */

const START_CASH = 1000
const START_AGE = 18
const YEARS = 10
const INVEST_GROWTH = 1.1 // 10% compounding per year
const DECISION_SECONDS = 30 // urgency window before the default auto-fires
const EVENT_SECONDS = 5

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const salaryFor = (year: number) => (year <= 1 ? 0 : 300 + (year - 2) * 100)

type Effect = {
  cashDelta: number
  investedDelta: number
  rationalityDelta: number
  resultText: string
  good: boolean
}

type Option = {
  label: string
  sublabel: string
  isDefault?: boolean // the tempting / inaction choice the timer auto-selects
  tone: 'impulse' | 'rational'
  apply: (s: { cash: number; invested: number }) => Effect
}

type Decision = {
  year: number
  bias: string
  icon: typeof Clock
  title: string
  scenario: string
  options: Option[]
}

const DECISIONS: Record<number, Decision> = {
  1: {
    year: 1,
    bias: 'Hyperbolic Discounting',
    icon: PartyPopper,
    title: 'The Festival Ticket',
    scenario:
      "You're 18 with $1,000. The festival everyone's hyped about is this weekend — or you could quietly start investing.",
    options: [
      {
        label: 'Buy the $300 festival ticket now',
        sublabel: 'Instant happiness this weekend',
        isDefault: true,
        tone: 'impulse',
        apply: () => ({
          cashDelta: -300,
          investedDelta: 0,
          rationalityDelta: -8,
          good: false,
          resultText:
            'Pure dopamine — but $300 that could have compounded for a decade is gone. Present-you robbed future-you.',
        }),
      },
      {
        label: 'Invest $300 in a 10% compounding asset',
        sublabel: 'Boring now, powerful later',
        tone: 'rational',
        apply: () => ({
          cashDelta: -300,
          investedDelta: 300,
          rationalityDelta: 6,
          good: true,
          resultText:
            'This $300 now compounds at 10%/yr. Future-you is already richer for resisting the instant hit.',
        }),
      },
    ],
  },
  3: {
    year: 3,
    bias: 'Sunk Cost Fallacy',
    icon: Wrench,
    title: 'The Clunker Car',
    scenario:
      'Your $200 clunker needs a $400 repair. A year of bus passes costs $100. "But I already spent $200 on this car..."',
    options: [
      {
        label: 'Fix it — I already put $200 in',
        sublabel: 'Honor the money already spent',
        isDefault: true,
        tone: 'impulse',
        apply: () => ({
          cashDelta: -400,
          investedDelta: 0,
          rationalityDelta: -8,
          good: false,
          resultText:
            'The original $200 is gone either way. You sank $400 more chasing it — textbook sunk cost fallacy.',
        }),
      },
      {
        label: 'Scrap it, take the bus ($100)',
        sublabel: 'Ignore the past, judge the future',
        tone: 'rational',
        apply: () => ({
          cashDelta: -100,
          investedDelta: 0,
          rationalityDelta: 6,
          good: true,
          resultText:
            'You ignored the unrecoverable $200 and paid only for future value. That is exactly how a rational actor decides.',
        }),
      },
    ],
  },
  5: {
    year: 5,
    bias: 'Herd Mentality / FOMO',
    icon: Flame,
    title: 'The Meme Coin Surge',
    scenario:
      'A meme coin is up 400%. Your entire feed is buying and posting gains. The fear of missing out is intense.',
    options: [
      {
        label: 'Ape in $500 — everyone is winning',
        sublabel: 'Follow the crowd before it’s too late',
        isDefault: true,
        tone: 'impulse',
        apply: () => {
          const moon = Math.random() < 0.25
          return moon
            ? {
                cashDelta: 250,
                investedDelta: 0,
                rationalityDelta: -10,
                good: false,
                resultText:
                  'Lucky — it kept pumping and you made $250. But you gambled blind on hype; the herd usually buys the top.',
              }
            : {
                cashDelta: -450,
                investedDelta: 0,
                rationalityDelta: -10,
                good: false,
                resultText:
                  'The bubble popped hours after you bought. You lost $450 buying the top — classic herd behavior.',
              }
        },
      },
      {
        label: 'Stay out, keep buying boring index funds',
        sublabel: 'Resist the FOMO',
        tone: 'rational',
        apply: () => ({
          cashDelta: -150,
          investedDelta: 150,
          rationalityDelta: 7,
          good: true,
          resultText:
            'You bought boring, diversified assets while the herd got rekt. Unsexy — and exactly right.',
        }),
      },
    ],
  },
  7: {
    year: 7,
    bias: 'Anchoring / Lifestyle Creep',
    icon: Home,
    title: 'The Coworker’s Apartment',
    scenario:
      'You got a raise. A coworker just leased a glossy $1,200/mo apartment and you feel behind. Match them?',
    options: [
      {
        label: 'Upgrade my lifestyle to match',
        sublabel: 'Keep up appearances',
        isDefault: true,
        tone: 'impulse',
        apply: () => ({
          cashDelta: -300,
          investedDelta: 0,
          rationalityDelta: -6,
          good: false,
          resultText:
            'Lifestyle creep: your coworker became the anchor, not your actual needs. The raise evaporated into rent.',
        }),
      },
      {
        label: 'Keep my rent, invest the raise',
        sublabel: 'Bank the difference',
        tone: 'rational',
        apply: () => ({
          cashDelta: -300,
          investedDelta: 300,
          rationalityDelta: 5,
          good: true,
          resultText:
            'You ignored the false anchor and routed the raise into investments instead of inflating your lifestyle.',
        }),
      },
    ],
  },
  9: {
    year: 9,
    bias: 'Loss Aversion',
    icon: TrendingUp,
    title: 'The Market Scare',
    scenario:
      'Markets dropped 15% in a panic. Your portfolio is a sea of red and the urge to "stop the bleeding" is overwhelming.',
    options: [
      {
        label: 'Panic-sell to stop the losses',
        sublabel: 'Make the pain stop now',
        isDefault: true,
        tone: 'impulse',
        apply: (s) => ({
          cashDelta: Math.round(s.invested * 0.05),
          investedDelta: -Math.round(s.invested * 0.2),
          rationalityDelta: -8,
          good: false,
          resultText:
            'You sold into the dip and locked in the loss. Markets recovered weeks later — loss aversion cost you real money.',
        }),
      },
      {
        label: 'Hold — I invest for decades',
        sublabel: 'Ride it out',
        tone: 'rational',
        apply: (s) => ({
          cashDelta: 0,
          investedDelta: Math.round(s.invested * 0.08),
          rationalityDelta: 7,
          good: true,
          resultText:
            'You held through the fear. The dip recovered and then some — paper losses never became real ones.',
        }),
      },
    ],
  },
}

const FLAVOR = [
  { text: 'Tax refund landed.', delta: 120 },
  { text: 'Phone screen cracked.', delta: -90 },
  { text: 'Picked up a side gig.', delta: 200 },
  { text: 'Surprise dentist bill.', delta: -150 },
  { text: 'Birthday cash from family.', delta: 80 },
  { text: 'Parking ticket.', delta: -60 },
]

/* ------------------------------------------------------------------ */
/*  Types for run state                                               */
/* ------------------------------------------------------------------ */

type Phase = 'intro' | 'decision' | 'event' | 'finished'

type TimelineEntry = {
  id: string
  year: number
  age: number
  kind: 'good' | 'trap' | 'event'
  title: string
  text: string
  bias?: string
}

type SeriesPoint = { age: number; netWorth: number; rationality: number }

type Game = {
  phase: Phase
  year: number
  cash: number
  invested: number
  rationality: number
  secondsLeft: number
  paused: boolean
  speed: number
  series: SeriesPoint[]
  timeline: TimelineEntry[]
}

const initialGame: Game = {
  phase: 'intro',
  year: 0,
  cash: START_CASH,
  invested: 0,
  rationality: 100,
  secondsLeft: 0,
  paused: false,
  speed: 1,
  series: [],
  timeline: [],
}

const uid = () => Math.random().toString(36).slice(2, 9)

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function LifeSimulator() {
  const { applyOutcome, logInfo, unlockBadge } = useNudge()
  const [game, setGameState] = React.useState<Game>(initialGame)
  const gameRef = React.useRef(game)

  // Keep a synchronous mirror so timer + handlers always read the latest state.
  const set = React.useCallback((patch: Partial<Game>) => {
    const next = { ...gameRef.current, ...patch }
    gameRef.current = next
    setGameState(next)
  }, [])

  const netWorth = (g: Game) => Math.round(g.cash + g.invested)

  const finish = React.useCallback(() => {
    const g = gameRef.current
    const nw = netWorth(g)
    set({ phase: 'finished', secondsLeft: 0 })
    logInfo({
      title: `Finished the 10-Year Life Run at $${nw.toLocaleString()}`,
      bias: 'Life Simulator',
      detail: `Ended at age ${START_AGE + YEARS - 1} with net worth ${money(
        nw,
      )} and a life-rationality of ${g.rationality}%.`,
    })
    unlockBadge('decade-survivor')
  }, [logInfo, set, unlockBadge])

  const enterYear = React.useCallback(
    (n: number) => {
      const g = gameRef.current
      if (n > YEARS) {
        finish()
        return
      }
      const age = START_AGE + n - 1
      // Compound existing investments + add salary at the start of the year.
      const invested = Math.round(g.invested * INVEST_GROWTH)
      const sal = salaryFor(n)
      let cash = g.cash + sal

      const decision = DECISIONS[n]
      if (decision) {
        set({
          year: n,
          cash,
          invested,
          phase: 'decision',
          secondsLeft: DECISION_SECONDS,
        })
        return
      }

      // Filler year: passive growth + a random flavour event, then auto-advance.
      const fe = FLAVOR[Math.floor(Math.random() * FLAVOR.length)]
      cash += fe.delta
      const nw = Math.round(cash + invested)
      const entry: TimelineEntry = {
        id: uid(),
        year: n,
        age,
        kind: fe.delta >= 0 ? 'event' : 'event',
        title: `Age ${age}`,
        text: `${sal ? `Salary +$${sal}. ` : ''}Investments compounded to ${money(
          invested,
        )}. ${fe.text} (${fe.delta >= 0 ? '+' : ''}$${fe.delta})`,
      }
      set({
        year: n,
        cash,
        invested,
        phase: 'event',
        secondsLeft: EVENT_SECONDS,
        series: [...g.series, { age, netWorth: nw, rationality: g.rationality }],
        timeline: [entry, ...g.timeline],
      })
    },
    [finish, set],
  )

  const choose = React.useCallback(
    (optionIndex: number, timedOut = false) => {
      const g = gameRef.current
      const decision = DECISIONS[g.year]
      if (!decision || g.phase !== 'decision') return
      const opt = decision.options[optionIndex]
      const eff = opt.apply({ cash: g.cash, invested: g.invested })

      const newCash = g.cash + eff.cashDelta
      const newInvested = Math.max(0, g.invested + eff.investedDelta)
      const newRationality = clamp(g.rationality + eff.rationalityDelta, 0, 100)
      const age = START_AGE + g.year - 1
      const nw = Math.round(newCash + newInvested)

      const entry: TimelineEntry = {
        id: uid(),
        year: g.year,
        age,
        kind: eff.good ? 'good' : 'trap',
        title: `Age ${age} · ${decision.title}`,
        bias: decision.bias,
        text:
          (timedOut
            ? 'You hesitated — the default chose for you. '
            : '') + eff.resultText,
      }

      set({
        cash: newCash,
        invested: newInvested,
        rationality: newRationality,
        series: [...g.series, { age, netWorth: nw, rationality: newRationality }],
        timeline: [entry, ...g.timeline],
      })

      // Feed the global dashboard metrics.
      applyOutcome({
        budgetDelta: eff.good ? 6 : -20,
        rationalityDelta: eff.rationalityDelta,
        kind: eff.good ? 'good' : 'trap',
        title: `Life Sim · ${decision.title}`,
        bias: decision.bias,
        detail: eff.resultText,
      })

      enterYear(g.year + 1)
    },
    [applyOutcome, enterYear, set],
  )

  // The single real-time clock.
  const tickRef = React.useRef<() => void>(() => {})
  tickRef.current = () => {
    const g = gameRef.current
    if (g.paused) return
    if (g.phase !== 'decision' && g.phase !== 'event') return
    const next = g.secondsLeft - g.speed
    if (next > 0) {
      set({ secondsLeft: next })
      return
    }
    if (g.phase === 'decision') {
      const decision = DECISIONS[g.year]
      const idx = decision.options.findIndex((o) => o.isDefault)
      choose(idx === -1 ? 0 : idx, true)
    } else {
      enterYear(g.year + 1)
    }
  }

  React.useEffect(() => {
    const id = setInterval(() => tickRef.current(), 1000)
    return () => clearInterval(id)
  }, [])

  const begin = () => {
    const fresh: Game = {
      ...initialGame,
      phase: 'event',
      series: [{ age: START_AGE, netWorth: START_CASH, rationality: 100 }],
      timeline: [
        {
          id: uid(),
          year: 0,
          age: START_AGE,
          kind: 'event',
          title: 'Age 18 · The run begins',
          text: `You start with ${money(
            START_CASH,
          )} in cash. Every ~30 seconds is one year. Hesitate on a decision and the default fires automatically.`,
        },
      ],
    }
    gameRef.current = fresh
    setGameState(fresh)
    enterYear(1)
  }

  const restart = () => {
    gameRef.current = initialGame
    setGameState(initialGame)
  }

  const g = game
  const nw = netWorth(g)
  const currentDecision = g.phase === 'decision' ? DECISIONS[g.year] : null
  const age = START_AGE + Math.max(0, g.year - 1)
  const progressPct = (g.secondsLeft / (g.phase === 'decision' ? DECISION_SECONDS : EVENT_SECONDS)) * 100

  /* ----------------------------- Intro ----------------------------- */
  if (g.phase === 'intro') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
          <Hourglass className="size-3" /> The 10-Minute Life Run
        </span>
        <h3 className="mx-auto mt-4 max-w-xl font-serif text-2xl font-semibold text-zinc-50 sm:text-3xl">
          Ten years of money choices, live
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
          You're 18 with{' '}
          <span className="font-semibold text-emerald-400">$1,000</span>. Each
          year a decision pops up — usually with a trap baked in. The clock's
          ticking, and if you freeze, the easy default picks for you. Watch your
          net worth and rationality split apart.
        </p>
        <button
          onClick={begin}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 transition-all"
        >
          <Play className="size-4" /> Start the Life Run
        </button>
      </div>
    )
  }

  /* --------------------------- Active / done ----------------------- */
  return (
    <div className="space-y-6">
      {/* Stat bar */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatChip
          icon={Clock}
          label="Age"
          value={`${age}`}
          sub={`Year ${Math.min(g.year, YEARS)}/${YEARS}`}
          tone="text-sky-400"
        />
        <StatChip
          icon={TrendingUp}
          label="Net Worth"
          value={money(nw)}
          sub={nw >= START_CASH ? 'growing' : 'shrinking'}
          tone={nw >= START_CASH ? 'text-emerald-400' : 'text-rose-400'}
        />
        <StatChip
          icon={Wallet}
          label="Cash"
          value={money(g.cash)}
          sub="liquid"
          tone="text-zinc-100"
        />
        <StatChip
          icon={PiggyBank}
          label="Invested"
          value={money(g.invested)}
          sub="@10%/yr"
          tone="text-emerald-400"
        />
        <StatChip
          icon={Brain}
          label="Rationality"
          value={`${g.rationality}%`}
          sub="this run"
          tone={
            g.rationality >= 70
              ? 'text-emerald-400'
              : g.rationality >= 45
                ? 'text-amber-400'
                : 'text-rose-400'
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: stage */}
        <div className="space-y-4">
          {/* Controls */}
          {g.phase !== 'finished' && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2">
              <button
                onClick={() => set({ paused: !g.paused })}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
              >
                {g.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                {g.paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => set({ speed: g.speed === 1 ? 3 : 1 })}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  g.speed > 1
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border-zinc-700 bg-zinc-800/60 text-zinc-200 hover:bg-zinc-800',
                )}
              >
                <FastForward className="size-3.5" /> {g.speed > 1 ? 'Fast' : 'Speed'}
              </button>
              <div className="ml-auto flex items-center gap-2 px-2">
                <Clock className="size-3.5 text-zinc-500" />
                <span className="font-mono text-xs tabular-nums text-zinc-300">
                  {Math.ceil(g.secondsLeft)}s
                </span>
              </div>
            </div>
          )}

          {/* Decision card */}
          {currentDecision && (
            <DecisionCard
              decision={currentDecision}
              progressPct={progressPct}
              secondsLeft={Math.ceil(g.secondsLeft)}
              onChoose={choose}
            />
          )}

          {/* Event beat */}
          {g.phase === 'event' && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="flex items-center gap-2 text-sky-400">
                <Clock className="size-4 animate-spin [animation-duration:3s]" />
                <span className="text-sm font-semibold">
                  {age >= START_AGE ? `Age ${age} passes…` : 'A year passes…'}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                {g.timeline[0]?.text}
              </p>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <button
                onClick={() => enterYear(g.year + 1)}
                className="mt-3 text-xs font-medium text-zinc-400 hover:text-zinc-200"
              >
                Skip ahead →
              </button>
            </div>
          )}

          {/* Finished */}
          {g.phase === 'finished' && (
            <FinishCard
              netWorth={nw}
              rationality={g.rationality}
              onRestart={restart}
            />
          )}

          {/* Chart */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="size-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-zinc-100">
                Net Worth vs Rationality
              </h4>
            </div>
            <div className="mt-3 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={g.series}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(92,70,58,0.25)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="age"
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#8a6f5e', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: '#8a6f5e', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #2a313c',
                      borderRadius: 12,
                      color: '#e6edf3',
                      fontSize: 12,
                    }}
                    formatter={(value: number, name) =>
                      name === 'netWorth'
                        ? [money(value), 'Net Worth']
                        : [`${value}%`, 'Rationality']
                    }
                    labelFormatter={(l) => `Age ${l}`}
                  />
                  <Legend
                    formatter={(v) =>
                      v === 'netWorth' ? 'Net Worth' : 'Rationality'
                    }
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#3fb950"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#3fb950' }}
                    isAnimationActive={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rationality"
                    stroke="#7bb2c0"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 2, fill: '#7bb2c0' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: timeline */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Clock className="size-4 text-emerald-400" /> Life Timeline
          </h4>
          <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto nudge-scroll pr-1">
            {g.timeline.map((e) => (
              <li
                key={e.id}
                className={cn(
                  'rounded-xl border p-3 nudge-rise',
                  e.kind === 'trap'
                    ? 'border-rose-500/20 bg-rose-500/5'
                    : e.kind === 'good'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-zinc-800 bg-zinc-800/30',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-100">
                    {e.title}
                  </span>
                  {e.bias && (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        e.kind === 'trap'
                          ? 'bg-rose-500/10 text-rose-300'
                          : 'bg-emerald-500/10 text-emerald-300',
                      )}
                    >
                      {e.bias}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                  {e.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function StatChip({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Clock
  label: string
  value: string
  sub: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <Icon className={cn('size-3.5', tone)} />
      </div>
      <p className={cn('mt-1 font-mono text-lg font-bold tabular-nums', tone)}>
        {value}
      </p>
      <p className="text-[10px] text-zinc-500">{sub}</p>
    </div>
  )
}

function DecisionCard({
  decision,
  progressPct,
  secondsLeft,
  onChoose,
}: {
  decision: Decision
  progressPct: number
  secondsLeft: number
  onChoose: (i: number, timedOut?: boolean) => void
}) {
  const Icon = decision.icon
  const urgent = secondsLeft <= 10
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-zinc-900/70 p-5 nudge-rise">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            {decision.bias}
          </p>
          <h4 className="font-serif text-lg font-semibold text-zinc-50">
            {decision.title}
          </h4>
        </div>
        <span
          className={cn(
            'ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-sm font-bold tabular-nums',
            urgent
              ? 'bg-rose-500/15 text-rose-300 nudge-flash'
              : 'bg-zinc-800 text-zinc-300',
          )}
        >
          <Clock className="size-3.5" /> {secondsLeft}s
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        {decision.scenario}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {decision.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onChoose(i)}
            className={cn(
              'group rounded-xl border p-3 text-left transition-all',
              opt.tone === 'impulse'
                ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50'
                : 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50',
            )}
          >
            <p className="text-sm font-semibold text-zinc-50">{opt.label}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{opt.sublabel}</p>
            {opt.isDefault && (
              <span className="mt-2 inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                default if you freeze
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-linear',
            urgent ? 'bg-rose-500' : 'bg-amber-400',
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="mt-2 text-center text-[11px] text-zinc-500">
        The ticking clock <span className="text-amber-300">is</span> the nudge.
      </p>
    </div>
  )
}

function FinishCard({
  netWorth,
  rationality,
  onRestart,
}: {
  netWorth: number
  rationality: number
  onRestart: () => void
}) {
  const archetype =
    rationality >= 80 && netWorth >= 2500
      ? { label: 'The Compounder', tone: 'text-emerald-400' }
      : rationality >= 60
        ? { label: 'The Steady Hand', tone: 'text-emerald-400' }
        : rationality >= 40
          ? { label: 'The Nudge-Prone', tone: 'text-amber-400' }
          : { label: 'The Impulse Spender', tone: 'text-rose-400' }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-center nudge-rise">
      <Trophy className="mx-auto size-8 text-emerald-400" />
      <h3 className="mt-3 font-serif text-2xl font-semibold text-zinc-50">
        Decade complete
      </h3>
      <p className="mt-1 text-sm text-zinc-400">
        You finished at age {START_AGE + YEARS - 1} as
      </p>
      <p className={cn('font-serif text-2xl font-bold', archetype.tone)}>
        {archetype.label}
      </p>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div>
          <p className="font-mono text-xl font-bold text-emerald-400">
            {money(netWorth)}
          </p>
          <p className="text-[11px] text-zinc-500">final net worth</p>
        </div>
        <div className="h-8 w-px bg-zinc-800" />
        <div>
          <p className="font-mono text-xl font-bold text-sky-400">
            {rationality}%
          </p>
          <p className="text-[11px] text-zinc-500">rationality</p>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
      >
        <RotateCcw className="size-4" /> Run it again
      </button>
    </div>
  )
}
