'use client'

import * as React from 'react'

/**
 * Global behavioral-economics game state shared across every page.
 * Tracks the player's "Rationality Score" and "Psychological Budget"
 * plus a running ledger of the decisions they make in the simulators.
 */

export type NudgeEventKind = 'trap' | 'good' | 'info'

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

type NudgeContextValue = NudgeState & {
  fallForTrap: (args: FallArgs) => void
  resistTrap: (args: ResistArgs) => void
  logInfo: (args: { title: string; detail: string; bias?: string }) => void
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
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const NudgeContext = React.createContext<NudgeContextValue | null>(null)

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<NudgeState>(initialState)
  const [hydrated, setHydrated] = React.useState(false)

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

  const reset = React.useCallback(() => {
    setState(initialState)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = React.useMemo<NudgeContextValue>(
    () => ({ ...state, fallForTrap, resistTrap, logInfo, reset }),
    [state, fallForTrap, resistTrap, logInfo, reset],
  )

  return <NudgeContext.Provider value={value}>{children}</NudgeContext.Provider>
}

export function useNudge() {
  const ctx = React.useContext(NudgeContext)
  if (!ctx) throw new Error('useNudge must be used within a NudgeProvider')
  return ctx
}
