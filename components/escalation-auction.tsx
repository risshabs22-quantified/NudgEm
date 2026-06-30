'use client'

import * as React from 'react'
import {
  Gavel,
  Bot,
  User,
  TrendingDown,
  Flame,
  RotateCcw,
  DollarSign,
  Trophy,
  HandCoins,
  AlertTriangle,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

const PRIZE = 20

type Status = 'active' | 'won' | 'folded'
type Turn = 'user' | 'bot'
type Move = { id: string; who: 'user' | 'bot' | 'system'; text: string }

const uid = () => Math.random().toString(36).slice(2, 9)

export function EscalationAuction() {
  const { applyOutcome, resistTrap, unlockBadge } = useNudge()

  const [userBid, setUserBid] = React.useState(0)
  const [botBid, setBotBid] = React.useState(1)
  const [status, setStatus] = React.useState<Status>('active')
  const [turn, setTurn] = React.useState<Turn>('user')
  const [log, setLog] = React.useState<Move[]>([
    { id: uid(), who: 'system', text: 'The bot opened the bidding at $1.' },
  ])
  const [result, setResult] = React.useState<{
    net: number
    headline: string
    detail: string
    good: boolean
  } | null>(null)

  const botCapRef = React.useRef(22 + Math.floor(Math.random() * 7)) // 22–28
  const botTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [])

  const addLog = (m: Omit<Move, 'id'>) =>
    setLog((l) => [{ id: uid(), ...m }, ...l].slice(0, 30))

  const resolve = (outcome: Status, finalUserBid: number) => {
    if (botTimer.current) clearTimeout(botTimer.current)
    setStatus(outcome)

    if (outcome === 'won') {
      const net = PRIZE - finalUserBid
      if (net >= 0) {
        setResult({
          net,
          good: true,
          headline: `Got the $20 for only $${finalUserBid}. Sheesh.`,
          detail:
            'The bot chickened out early so you actually profited. That basically never happens — these auctions usually blow way past $20.',
        })
        applyOutcome({
          budgetDelta: net,
          rationalityDelta: 3,
          kind: 'good',
          title: 'Won the $20 auction cheap',
          bias: 'Sunk Cost Fallacy',
          detail: `Snagged the $20 for $${finalUserBid}.`,
        })
        unlockBadge('sunk-cost-slayer')
      } else {
        setResult({
          net,
          good: false,
          headline: `You "won" $20... by paying $${finalUserBid} for it.`,
          detail: `So you're down $${Math.abs(
            net,
          )}. Every extra dollar felt worth it to not "lose" — that feeling is the sunk cost trap, and it just cleaned you out.`,
        })
        applyOutcome({
          budgetDelta: net,
          rationalityDelta: -clamp(Math.round(finalUserBid / 2), 4, 18),
          kind: 'trap',
          title: `Overpaid $${finalUserBid} to "win" a $20`,
          bias: 'Sunk Cost Fallacy',
          detail: `Paid $${finalUserBid} for a $20 bill. Down $${Math.abs(
            net,
          )}.`,
        })
      }
    } else {
      // folded
      if (finalUserBid === 0) {
        setResult({
          net: 0,
          good: true,
          headline: 'You didn’t even play. Genuinely the only way to win.',
          detail:
            'Zero bids, zero loss. In this rigged auction the smart move is to never touch it. You passed the test most people fail.',
        })
        resistTrap({
          rationalityGain: 6,
          title: 'Noped out of the rigged auction',
          bias: 'Sunk Cost Fallacy',
          detail: 'Saw the trap and refused to bid a cent.',
        })
        unlockBadge('sunk-cost-slayer')
      } else {
        setResult({
          net: -finalUserBid,
          good: false,
          headline: `You folded — and you STILL owe your $${finalUserBid}.`,
          detail: `Plot twist: in this auction the loser pays their bid too and gets nothing. You burned $${finalUserBid} chasing money that was already gone.`,
        })
        applyOutcome({
          budgetDelta: -finalUserBid,
          rationalityDelta: -clamp(Math.round(finalUserBid / 2), 3, 15),
          kind: 'trap',
          title: 'Folded the auction, still paid up',
          bias: 'Sunk Cost Fallacy',
          detail: `Lost $${finalUserBid} for literally nothing.`,
        })
      }
    }
  }

  const botRespond = (currentUserBid: number) => {
    botTimer.current = setTimeout(() => {
      const needed = currentUserBid + 1
      if (needed > botCapRef.current) {
        addLog({
          who: 'bot',
          text: `The bot folds at $${currentUserBid + 1 - 1}. You win the $20!`,
        })
        resolve('won', currentUserBid)
      } else {
        setBotBid(needed)
        setTurn('user')
        addLog({ who: 'bot', text: `Bot raises to $${needed}.` })
      }
    }, 850)
  }

  const raise = () => {
    if (status !== 'active' || turn !== 'user') return
    const next = botBid + 1
    setUserBid(next)
    setTurn('bot')
    addLog({ who: 'user', text: `You raise to $${next}.` })
    botRespond(next)
  }

  const fold = () => {
    if (status !== 'active') return
    addLog({ who: 'user', text: `You fold at $${userBid}.` })
    resolve('folded', userBid)
  }

  const restart = () => {
    if (botTimer.current) clearTimeout(botTimer.current)
    botCapRef.current = 22 + Math.floor(Math.random() * 7)
    setUserBid(0)
    setBotBid(1)
    setStatus('active')
    setTurn('user')
    setResult(null)
    setLog([
      { id: uid(), who: 'system', text: 'New auction. The bot opens at $1.' },
    ])
  }

  const leader = userBid > botBid ? 'user' : 'bot'
  const nextRaise = botBid + 1

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Arena */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">

        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30">
            <Gavel className="size-5" />
          </span>
          <div>
            <h4 className="font-serif text-lg font-semibold text-zinc-50">
              The Escalation Pit
            </h4>
            <p className="text-[11px] text-zinc-500">
              Bid on a $20 bill · catch: the loser pays their bid too
            </p>
          </div>
        </div>

        {/* The prize */}
        <div className="mt-4 flex flex-col items-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-5">
          <span className="text-[11px] uppercase tracking-wider text-emerald-400/80">
            On the block
          </span>
          <div className="mt-1 flex items-center gap-1 font-mono text-4xl font-bold text-emerald-400 text-glow-emerald">
            <DollarSign className="size-7" />
            20
          </div>
          <span className="mt-1 text-[11px] text-zinc-500">
            one crisp twenty. easy, right?
          </span>
        </div>

        {/* Bids */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <BidPanel
            who="You"
            icon={User}
            bid={userBid}
            leading={leader === 'user' && status === 'active'}
            tone="emerald"
          />
          <BidPanel
            who="AI Bot"
            icon={Bot}
            bid={botBid}
            leading={leader === 'bot' && status === 'active'}
            tone="rose"
            thinking={turn === 'bot' && status === 'active'}
          />
        </div>

        {/* Actions */}
        {status === 'active' ? (
          <div className="mt-4 space-y-2">
            <button
              onClick={raise}
              disabled={turn !== 'user'}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Flame className="size-4" />
              {turn === 'user'
                ? `Raise bid to $${nextRaise}`
                : 'Bot is bidding…'}
            </button>
            <button
              onClick={fold}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <HandCoins className="size-4" />
              {userBid === 0 ? 'Walk away (bid $0)' : 'Cut losses & fold'}
            </button>
          </div>
        ) : (
          <button
            onClick={restart}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            <RotateCcw className="size-4" /> Play again
          </button>
        )}
      </div>

      {/* Analysis */}
      <div className="flex flex-col gap-4">
        {/* Waste ticker */}
        <div
          className={cn(
            'rounded-2xl border p-4 transition-colors',
            userBid > PRIZE
              ? 'border-rose-500/40 bg-rose-500/10'
              : 'border-zinc-800 bg-zinc-900/60',
          )}
        >
          <div className="flex items-center gap-2 text-rose-300">
            <TrendingDown className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Money on the line
            </span>
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-zinc-50">
            ${userBid}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {status === 'active'
              ? userBid === 0
                ? 'Nothing yet. Keep it that way.'
                : `Quit now and you eat $${userBid} for nothing.`
              : 'Final tally — money you walked away owing'}
          </p>
          {userBid > PRIZE && status === 'active' && (
            <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-500/15 px-2 py-1.5 text-[11px] font-medium text-rose-300">
              <AlertTriangle className="size-3.5" />
              You’re now bidding more than $20 to win $20. This is the trap. Bail.
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className={cn(
              'rounded-2xl border p-4 nudge-rise',
              result.good
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-rose-500/40 bg-rose-500/5',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg',
                  result.good
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400',
                )}
              >
                {result.good ? (
                  <Trophy className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
              </span>
              <p className="text-sm font-semibold text-zinc-100">
                {result.headline}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {result.detail}
            </p>
          </div>
        )}

        {/* Log */}
        <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Bid history
          </h5>
          <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto nudge-scroll pr-1">
            {log.map((m) => (
              <li
                key={m.id}
                className={cn(
                  'flex items-center gap-2 text-xs',
                  m.who === 'user'
                    ? 'text-emerald-300'
                    : m.who === 'bot'
                      ? 'text-rose-300'
                      : 'text-zinc-500',
                )}
              >
                <span className="font-mono text-zinc-600">›</span>
                {m.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function BidPanel({
  who,
  icon: Icon,
  bid,
  leading,
  tone,
  thinking,
}: {
  who: string
  icon: typeof User
  bid: number
  leading: boolean
  tone: 'emerald' | 'rose'
  thinking?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 text-center transition-all',
        leading
          ? tone === 'emerald'
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : 'border-rose-500/50 bg-rose-500/10'
          : 'border-zinc-800 bg-zinc-800/30',
      )}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Icon
          className={cn(
            'size-4',
            tone === 'emerald' ? 'text-emerald-400' : 'text-rose-400',
          )}
        />
        <span className="text-xs font-medium text-zinc-300">{who}</span>
      </div>
      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-zinc-50">
        ${bid}
      </p>
      {thinking ? (
        <p className="text-[10px] text-rose-400/80">thinking…</p>
      ) : leading ? (
        <p
          className={cn(
            'text-[10px]',
            tone === 'emerald' ? 'text-emerald-400/80' : 'text-rose-400/80',
          )}
        >
          leading
        </p>
      ) : (
        <p className="text-[10px] text-zinc-600">behind</p>
      )}
    </div>
  )
}
