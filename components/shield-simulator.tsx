'use client'

import * as React from 'react'
import {
  Shield,
  ShieldOff,
  Clock,
  Flame,
  X,
  Users,
  Lock,
  Check,
  Leaf,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

export function ShieldSimulator() {
  const { logInfo } = useNudge()
  const [shield, setShield] = React.useState(false)
  const logged = React.useRef(false)

  const toggle = () => {
    setShield((v) => {
      const next = !v
      if (next && !logged.current) {
        logged.current = true
        logInfo({
          title: 'Enabled the NudgeEm Shield',
          bias: 'Consumer Protection',
          detail: 'Saw the same checkout with all the tricks stripped out.',
        })
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Toggle bar */}
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition-colors',
          shield ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/5',
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              shield ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
            )}
          >
            {shield ? <Shield className="size-5" /> : <ShieldOff className="size-5" />}
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              NudgeEm Shield Extension
            </p>
            <p className="text-[11px] text-zinc-500">
              {shield
                ? 'On — panic buttons replaced with plain facts.'
                : 'Off — this is what most checkout pages look like.'}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all',
            shield ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-200',
          )}
        >
          {shield ? <Shield className="size-4" /> : <ShieldOff className="size-4" />}
          {shield ? 'Shield ON' : 'Enable Shield'}
        </button>
      </div>

      {/* Mock browser */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {/* Chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-800/40 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-rose-400/70" />
            <span className="size-3 rounded-full bg-amber-400/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
          </div>
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-500">
            <Lock className="size-3" /> mega-deals-store.example/checkout
          </div>
          {shield && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              <Shield className="size-3" /> protected
            </span>
          )}
        </div>

        {/* Page */}
        <div className="relative p-4">
          {/* Newsletter popup (only without shield) */}
          {!shield && (
            <div className="absolute right-3 top-3 z-20 w-48 rounded-xl border border-amber-500/40 bg-zinc-950/95 p-3 shadow-xl nudge-rise">
              <button className="absolute right-1.5 top-1.5 text-zinc-500">
                <X className="size-3.5" />
              </button>
              <p className="text-xs font-bold text-amber-300">WAIT! 🎁</p>
              <p className="mt-1 text-[10px] text-zinc-400">
                Get 10% off — enter your email before you lose this deal forever!
              </p>
              <div className="mt-2 h-5 rounded bg-zinc-800" />
              <div className="mt-1 h-5 rounded bg-amber-500/70" />
            </div>
          )}

          {/* Social proof toast (only without shield) */}
          {!shield && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950/95 px-2 py-1.5 text-[10px] text-zinc-300 nudge-rise">
              <Users className="size-3 text-amber-400" /> Mia in Denver just bought this!
            </div>
          )}

          <div className="rounded-xl bg-zinc-100 p-4 text-zinc-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                  Checkout
                </p>
                <h5 className="text-base font-bold">UltraBoost Blender 3000</h5>
              </div>
              {/* Timer / disclosure */}
              {shield ? (
                <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  <Check className="size-3" /> No real time limit
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-600 nudge-pulse-danger">
                  <Clock className="size-3.5 nudge-flash" /> 02:59
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-extrabold">$59</span>
              {shield ? (
                <span className="text-[11px] text-zinc-500">Typical price online: ~$55</span>
              ) : (
                <span className="text-sm text-zinc-400 line-through">$199</span>
              )}
            </div>

            {/* Scarcity */}
            {shield ? (
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
                <Check className="size-3.5" /> Stock level hidden (it was unverifiable)
              </p>
            ) : (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                <Flame className="size-3.5" /> Only 1 left · 47 people viewing!
              </p>
            )}

            {/* Add-on */}
            <div className="mt-3 rounded-lg border border-zinc-300 bg-white p-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-800">
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded',
                    shield ? 'border border-zinc-300 bg-white' : 'bg-emerald-500 text-white',
                  )}
                >
                  {!shield && <Check className="size-3" />}
                </span>
                Add 3-Year Protection (+$24.99)
              </label>
              <p className="mt-1 pl-6 text-[10px] text-zinc-400">
                {shield
                  ? 'Add-on unchecked by default — opt in only if you want it.'
                  : 'No thanks, I like living dangerously.'}
              </p>
            </div>

            {/* Summary */}
            <div className="mt-3 space-y-1 rounded-lg bg-zinc-50 p-2.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Item</span>
                <span>$59.00</span>
              </div>
              {shield ? (
                <>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipping (shown upfront)</span>
                    <span>$9.90</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 pt-1 font-bold">
                    <span>Total — all in</span>
                    <span>$68.90</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>Total</span>
                  <span>$59.00*</span>
                </div>
              )}
              {!shield && (
                <p className="text-[9px] text-zinc-400">
                  *plus fees calculated at the final step
                </p>
              )}
            </div>

            <button
              className={cn(
                'mt-3 w-full rounded-lg py-2 text-sm font-bold text-white',
                shield ? 'bg-emerald-600' : 'bg-rose-500',
              )}
            >
              {shield ? 'Buy calmly' : 'BUY NOW BEFORE IT’S GONE!'}
            </button>
          </div>

          {shield && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
              <Leaf className="size-4 shrink-0" />
              Same product, zero pressure — just the facts, no tricks.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
