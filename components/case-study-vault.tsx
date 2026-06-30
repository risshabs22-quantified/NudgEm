'use client'

import * as React from 'react'
import {
  BookMarked,
  ChevronDown,
  FlaskConical,
  Coffee,
  Anchor,
  Calculator,
  Shirt,
  CheckCircle2,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

/* -------------------- Mini-widget: Mental Accounting -------------------- */
function MentalAccountingWidget() {
  const [calc, setCalc] = React.useState<boolean | null>(null)
  const [jacket, setJacket] = React.useState<boolean | null>(null)
  const done = calc !== null && jacket !== null

  const inconsistent = calc === true && jacket === false

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Calculator className="size-3.5 text-sky-400" /> A $15 calculator
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Drive 20 min to another store to save $5 (it&apos;s $10 there)?
          </p>
          <div className="mt-2 flex gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setCalc(v)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all',
                  calc === v
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:text-zinc-200',
                )}
              >
                {v ? 'Yes, drive' : "No, don't"}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Shirt className="size-3.5 text-violet-400" /> A $125 jacket
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Drive 20 min to another store to save $5 (it&apos;s $120 there)?
          </p>
          <div className="mt-2 flex gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setJacket(v)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all',
                  jacket === v
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                    : 'border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:text-zinc-200',
                )}
              >
                {v ? 'Yes, drive' : "No, don't"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {done && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 nudge-rise">
          <p className="text-xs leading-relaxed text-zinc-300">
            {inconsistent ? (
              <>
                <span className="font-semibold text-emerald-300">
                  You just replicated the experiment.
                </span>{' '}
                You&apos;d drive for the calculator but not the jacket — yet it&apos;s
                the <span className="font-semibold">same $5</span> and the same 20
                minutes. Thaler showed we file the saving as a % of the purchase,
                not as absolute money.
              </>
            ) : (
              <>
                $5 is $5 and 20 minutes is 20 minutes in both cases — your answers
                were consistent, which is the rational stance most people{' '}
                <span className="font-semibold">fail</span>. Classic studies find
                far more people drive for the cheap item.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

/* -------------------- Mini-widget: Endowment Effect -------------------- */
function EndowmentWidget() {
  const [sell, setSell] = React.useState(7)
  const [buy, setBuy] = React.useState(3)
  const gap = sell - buy
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
        <p className="flex items-center justify-between text-xs text-zinc-200">
          <span className="flex items-center gap-1.5">
            <Coffee className="size-3.5 text-amber-400" /> You OWN this mug. Sell it for…
          </span>
          <span className="font-mono font-bold text-zinc-50">${sell}</span>
        </p>
        <input type="range" min={0} max={15} value={sell} onChange={(e) => setSell(Number(e.target.value))} className="nudge-range mt-2 w-full" />
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
        <p className="flex items-center justify-between text-xs text-zinc-200">
          <span className="flex items-center gap-1.5">
            <Coffee className="size-3.5 text-zinc-500" /> You DON&apos;T own it. Pay at most…
          </span>
          <span className="font-mono font-bold text-zinc-50">${buy}</span>
        </p>
        <input type="range" min={0} max={15} value={buy} onChange={(e) => setBuy(Number(e.target.value))} className="nudge-range mt-2 w-full" />
      </div>
      <p className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 text-xs leading-relaxed text-zinc-300">
        Your sell price is{' '}
        <span className={cn('font-semibold', gap > 0 ? 'text-violet-300' : 'text-zinc-400')}>
          ${Math.max(0, gap)} higher
        </span>{' '}
        than your buy price for the <em>identical</em> mug. Kahneman, Knetsch &amp;
        Thaler found owners demand roughly 2× what buyers will pay — merely owning
        something inflates its value.
      </p>
    </div>
  )
}

/* -------------------- Mini-widget: Anchoring -------------------- */
function AnchoringWidget() {
  const [anchor, setAnchor] = React.useState<number | null>(null)
  const [guess, setGuess] = React.useState('')
  const [revealed, setRevealed] = React.useState(false)
  const spin = () => {
    setAnchor(Math.random() < 0.5 ? 10 : 65)
    setGuess('')
    setRevealed(false)
  }
  return (
    <div className="space-y-3">
      {anchor === null ? (
        <button
          onClick={spin}
          className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2.5 text-sm font-bold text-zinc-950 transition-all hover:scale-[1.01]"
        >
          Spin the wheel of fortune 🎡
        </button>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 text-center">
            <p className="text-[11px] text-zinc-500">The wheel landed on</p>
            <p className="font-mono text-3xl font-bold text-amber-400">{anchor}</p>
          </div>
          <p className="text-xs text-zinc-300">
            Now estimate: what % of the world&apos;s countries are in Africa?
          </p>
          <div className="flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              inputMode="numeric"
              placeholder="your %"
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/50 px-2 py-1.5 text-sm text-zinc-100 focus:outline-none"
            />
            <button
              onClick={() => setRevealed(true)}
              disabled={!guess}
              className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
            >
              Reveal
            </button>
            <button onClick={spin} className="rounded-lg px-2 text-xs text-zinc-500 hover:text-zinc-300">
              re-spin
            </button>
          </div>
          {revealed && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-zinc-300 nudge-rise">
              The real answer is ~28%. In Tversky &amp; Kahneman&apos;s study,
              people who saw a <span className="font-semibold">low</span> wheel
              number guessed far lower than those who saw a high one — even though
              the wheel was random and irrelevant. If your guess drifted toward{' '}
              <span className="font-semibold text-amber-300">{anchor}</span>,
              that&apos;s the anchor at work.
            </p>
          )}
        </>
      )}
    </div>
  )
}

/* -------------------- The vault -------------------- */
type Study = {
  id: string
  title: string
  authors: string
  year: string
  summary: string
  Widget: React.ComponentType
  icon: typeof FlaskConical
}

const STUDIES: Study[] = [
  {
    id: 'mental-accounting',
    title: 'Mental Accounting & the $5 that isn’t',
    authors: 'Richard Thaler',
    year: '1985',
    summary:
      'We sort money into mental "accounts" instead of treating it as fungible, so the same $5 feels big on a cheap item and trivial on an expensive one.',
    Widget: MentalAccountingWidget,
    icon: Calculator,
  },
  {
    id: 'endowment',
    title: 'The Endowment Effect (the coffee mugs)',
    authors: 'Kahneman, Knetsch & Thaler',
    year: '1990',
    summary:
      'Simply owning something raises how much we value it. Sellers demand far more than buyers will pay for the very same object.',
    Widget: EndowmentWidget,
    icon: Coffee,
  },
  {
    id: 'anchoring',
    title: 'Anchoring & the Wheel of Fortune',
    authors: 'Tversky & Kahneman',
    year: '1974',
    summary:
      'A completely random number shown first drags our later estimates toward it — even when we know it is irrelevant.',
    Widget: AnchoringWidget,
    icon: Anchor,
  },
]

export function CaseStudyVault() {
  const { logInfo } = useNudge()
  const [open, setOpen] = React.useState<string | null>(STUDIES[0].id)
  const seen = React.useRef<Set<string>>(new Set())

  const toggle = (id: string) => {
    const next = open === id ? null : id
    setOpen(next)
    if (next && !seen.current.has(next)) {
      seen.current.add(next)
      const s = STUDIES.find((x) => x.id === next)!
      logInfo({
        title: `Opened case study: ${s.title}`,
        bias: 'Research',
        detail: `${s.authors} (${s.year})`,
      })
    }
  }

  return (
    <div className="space-y-3">
      {STUDIES.map((s) => {
        const isOpen = open === s.id
        const Icon = s.icon
        const Widget = s.Widget
        return (
          <div
            key={s.id}
            className={cn(
              'overflow-hidden rounded-2xl border transition-colors',
              isOpen ? 'border-violet-500/30 bg-zinc-900/60' : 'border-zinc-800 bg-zinc-900/40',
            )}
          >
            <button
              onClick={() => toggle(s.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-base font-semibold text-zinc-50">
                  {s.title}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {s.authors} · {s.year}
                </p>
              </div>
              <ChevronDown
                className={cn('size-4 shrink-0 text-zinc-500 transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-zinc-800 p-4 nudge-rise">
                <p className="text-sm leading-relaxed text-zinc-400">{s.summary}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
                  <FlaskConical className="size-3.5" /> Replicate the experiment
                </div>
                <Widget />
              </div>
            )}
          </div>
        )
      })}
      <p className="flex items-center gap-1.5 px-1 text-[11px] text-zinc-600">
        <BookMarked className="size-3" /> Interactive recreations of the studies
        that built behavioral economics.
      </p>
    </div>
  )
}
