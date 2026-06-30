'use client'

import * as React from 'react'
import { BADGES } from '@/lib/badges'

/**
 * Global behavioral-economics game state shared across every page.
 * Tracks the player's "Rationality Score" and "Psychological Budget"
 * plus a running ledger of the decisions they make in the simulators.
 */

export type NudgeEventKind = 'trap' | 'good' | 'info'

export type TrapStat = { fell: number; avoided: number }

export type NudgeEvent = {
  id: string
  kind: NudgeEventKind
  title: string
  detail: string
  bias?: string
  amount?: number
  rationality?: number
  at: number
}

type NudgeState = {
  rationality: number
  budget: number
  startingBudget: number
  events: NudgeEvent[]
  trapsAvoided: number
  trapsFallen: number
  decisions: number
  moneySaved: number
  moneyLost: number
  /** Unlocked achievement ids. */
  badges: string[]
  /** Per-bias tally feeding the Community "herd" map. */
  trapStats: Record<string, TrapStat>
  /** Whether today's Daily Nudge teaser has been answered. */
  dailyAnswered: boolean
}

type FallArgs = {
  cost: number
  rationalityHit: number
  title: string
  bias: string
  detail: string
}

type ResistArgs = {
  rationalityGain?: number
  title: string
  bias: string
  detail: string
}

type OutcomeArgs = {
  /** Positive credits the budget, negative debits it. */
  budgetDelta?: number
  /** Positive raises the Rationality Score, negative lowers it. */
  rationalityDelta?: number
  kind: NudgeEventKind
  title: string
  bias?: string
  detail: string
}

type NudgeContextValue = NudgeState & {
  fallForTrap: (args: FallArgs) => void
  resistTrap: (args: ResistArgs) => void
  /**
   * Generic, flexible feedback hook used by the larger simulators (Life
   * Simulator, Escalation Auction, etc.). Lets a module push an arbitrary
   * budget/rationality delta into the global dashboard metrics in one call.
   */
  applyOutcome: (args: OutcomeArgs) => void
  logInfo: (args: { title: string; detail: string; bias?: string }) => void
  /** Unlock an achievement by id (no-op if already unlocked). */
  unlockBadge: (id: string) => void
  /** Mark the Daily Nudge teaser answered for this cycle. */
  markDailyAnswered: () => void
  /** Most-recently unlocked badge id, drives the confetti toast. */
  recentBadge: string | null
  clearRecentBadge: () => void
  reset: () => void
}

const STARTING_BUDGET = 500
const STARTING_RATIONALITY = 100
const STORAGE_KEY = 'nudgeem-state-v1'

const initialState: NudgeState = {
  rationality: STARTING_RATIONALITY,
  budget: STARTING_BUDGET,
  startingBudget: STARTING_BUDGET,
  events: [],
  trapsAvoided: 0,
  trapsFallen: 0,
  decisions: 0,
  moneySaved: 0,
  moneyLost: 0,
  badges: [],
  trapStats: {},
  dailyAnswered: false,
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Immutably bump a per-bias trap tally. */
const bumpTrap = (
  stats: Record<string, TrapStat>,
  bias: string | undefined,
  key: keyof TrapStat,
): Record<string, TrapStat> => {
  if (!bias) return stats
  const cur = stats[bias] ?? { fell: 0, avoided: 0 }
  return { ...stats, [bias]: { ...cur, [key]: cur[key] + 1 } }
}

const NudgeContext = React.createContext<NudgeContextValue | null>(null)

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<NudgeState>(initialState)
  const [hydrated, setHydrated] = React.useState(false)
  // Transient (not persisted) — drives the badge-unlock confetti toast.
  const [recentBadge, setRecentBadge] = React.useState<string | null>(null)

  // Restore from localStorage so progress survives navigation/refresh.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<NudgeState>
        setState((s) => ({ ...s, ...parsed }))
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable */
    }
  }, [state, hydrated])

  const pushEvent = React.useCallback((event: NudgeEvent) => {
    setState((s) => ({ ...s, events: [event, ...s.events].slice(0, 14) }))
  }, [])

  const fallForTrap = React.useCallback(
    ({ cost, rationalityHit, title, bias, detail }: FallArgs) => {
      const ev: NudgeEvent = {
        id: uid(),
        kind: 'trap',
        title,
        detail,
        bias,
        amount: -Math.abs(cost),
        rationality: -Math.abs(rationalityHit),
        at: Date.now(),
      }
      setState((s) => ({
        ...s,
        budget: Math.max(0, s.budget - Math.abs(cost)),
        rationality: clamp(s.rationality - Math.abs(rationalityHit), 0, 100),
        trapsFallen: s.trapsFallen + 1,
        decisions: s.decisions + 1,
        moneyLost: s.moneyLost + Math.abs(cost),
        trapStats: bumpTrap(s.trapStats, bias, 'fell'),
        events: [ev, ...s.events].slice(0, 14),
      }))
    },
    [],
  )

  const resistTrap = React.useCallback(
    ({ rationalityGain = 2, title, bias, detail }: ResistArgs) => {
      const ev: NudgeEvent = {
        id: uid(),
        kind: 'good',
        title,
        detail,
        bias,
        rationality: Math.abs(rationalityGain),
        at: Date.now(),
      }
      setState((s) => ({
        ...s,
        rationality: clamp(s.rationality + Math.abs(rationalityGain), 0, 100),
        trapsAvoided: s.trapsAvoided + 1,
        decisions: s.decisions + 1,
        moneySaved: s.moneySaved + 0,
        trapStats: bumpTrap(s.trapStats, bias, 'avoided'),
        events: [ev, ...s.events].slice(0, 14),
      }))
    },
    [],
  )

  const applyOutcome = React.useCallback(
    ({
      budgetDelta = 0,
      rationalityDelta = 0,
      kind,
      title,
      bias,
      detail,
    }: OutcomeArgs) => {
      const ev: NudgeEvent = {
        id: uid(),
        kind,
        title,
        detail,
        bias,
        amount: budgetDelta !== 0 ? budgetDelta : undefined,
        rationality: rationalityDelta !== 0 ? rationalityDelta : undefined,
        at: Date.now(),
      }
      setState((s) => ({
        ...s,
        budget: Math.max(0, s.budget + budgetDelta),
        rationality: clamp(s.rationality + rationalityDelta, 0, 100),
        trapsFallen: kind === 'trap' ? s.trapsFallen + 1 : s.trapsFallen,
        trapsAvoided: kind === 'good' ? s.trapsAvoided + 1 : s.trapsAvoided,
        decisions: kind === 'info' ? s.decisions : s.decisions + 1,
        moneyLost: budgetDelta < 0 ? s.moneyLost + Math.abs(budgetDelta) : s.moneyLost,
        moneySaved: budgetDelta > 0 ? s.moneySaved + budgetDelta : s.moneySaved,
        trapStats:
          kind === 'trap'
            ? bumpTrap(s.trapStats, bias, 'fell')
            : kind === 'good'
              ? bumpTrap(s.trapStats, bias, 'avoided')
              : s.trapStats,
        events: [ev, ...s.events].slice(0, 14),
      }))
    },
    [],
  )

  const logInfo = React.useCallback(
    ({ title, detail, bias }: { title: string; detail: string; bias?: string }) => {
      pushEvent({ id: uid(), kind: 'info', title, detail, bias, at: Date.now() })
    },
    [pushEvent],
  )

  const unlockBadge = React.useCallback((id: string) => {
    setState((s) => {
      if (s.badges.includes(id)) return s
      setRecentBadge(id)
      return { ...s, badges: [...s.badges, id] }
    })
  }, [])

  const markDailyAnswered = React.useCallback(() => {
    setState((s) => ({ ...s, dailyAnswered: true }))
  }, [])

  const clearRecentBadge = React.useCallback(() => setRecentBadge(null), [])

  // Auto-unlock stat-based badges whenever the relevant metrics change.
  React.useEffect(() => {
    if (!hydrated) return
    const ctx = {
      rationality: state.rationality,
      trapsAvoided: state.trapsAvoided,
      trapsFallen: state.trapsFallen,
      decisions: state.decisions,
    }
    for (const b of BADGES) {
      if (b.auto && b.auto(ctx) && !state.badges.includes(b.id)) {
        unlockBadge(b.id)
      }
    }
  }, [
    hydrated,
    state.rationality,
    state.trapsAvoided,
    state.trapsFallen,
    state.decisions,
    state.badges,
    unlockBadge,
  ])

  const reset = React.useCallback(() => {
    setState(initialState)
    setRecentBadge(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = React.useMemo<NudgeContextValue>(
    () => ({
      ...state,
      fallForTrap,
      resistTrap,
      applyOutcome,
      logInfo,
      unlockBadge,
      markDailyAnswered,
      recentBadge,
      clearRecentBadge,
      reset,
    }),
    [
      state,
      fallForTrap,
      resistTrap,
      applyOutcome,
      logInfo,
      unlockBadge,
      markDailyAnswered,
      recentBadge,
      clearRecentBadge,
      reset,
    ],
  )

  return <NudgeContext.Provider value={value}>{children}</NudgeContext.Provider>
}

export function useNudge() {
  const ctx = React.useContext(NudgeContext)
  if (!ctx) throw new Error('useNudge must be used within a NudgeProvider')
  return ctx
}
