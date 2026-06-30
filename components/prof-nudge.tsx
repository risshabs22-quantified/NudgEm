'use client'

import * as React from 'react'
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  GraduationCap,
} from 'lucide-react'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'coach'; text: string }

const uid = () => Math.random().toString(36).slice(2, 9)

const PRESETS = [
  'Talk me out of buying this gaming console on sale.',
  'Should I keep all my streaming subscriptions?',
  'I want a $7 designer coffee every morning.',
  "Everyone's buying this hot stock. Should I jump in?",
]

type Ctx = { budget: number; rationality: number; startingBudget: number }

function respond(raw: string, ctx: Ctx): string {
  const q = raw.toLowerCase()
  const money = `$${ctx.budget}`
  const moodLow = ctx.rationality < 50

  const has = (...keys: string[]) => keys.some((k) => q.includes(k))

  if (has('console', 'sneaker', 'sneaker', 'buy', 'cop', 'checkout', 'cart', 'talk me out')) {
    return `Classic hot-state buying. That "sale" price is an anchor — they picked the discount, not you. Before tapping buy, sleep on it 24 hours; if you still want it tomorrow it's a want, not a nudge. Your Psychological Budget is ${money} — is this purchase worth more than everything else it could become? (Scarcity + Anchoring detected.)`
  }
  if (has('subscription', 'renew', 'streaming', 'cancel', 'membership')) {
    return `Default Bias alert. Auto-renewals win because cancelling takes effort, not because you value them. Audit every one: would you actively re-subscribe today at full price? If not, cancel it now while you're thinking about it. A forgotten $15/mo is $1,800 a decade.`
  }
  if (has('coffee', 'daily', 'every day', 'every morning', 'energy drink', 'habit')) {
    return `Hyperbolic discounting in a cup. $7/day feels trivial because the cost is now and the payoff is invisible. Run it through the Time Machine: that habit invested at 8% is a five-figure number by your 40s. Keep the ritual maybe — just not every single day.`
  }
  if (has('stock', 'crypto', 'meme', 'everyone', 'fomo', 'pump', 'invest now')) {
    return `Herd Mentality + FOMO. "Everyone's buying" is social proof, not analysis — and crowds usually arrive at the top. If your thesis is "the line went up," that's not a thesis. Decide your number coldly, or stay out. The feeling of missing out is the product they're selling you.`
  }
  if (has('save', 'budget', 'invest', 'retire')) {
    return `Now you're talking. Make the rational choice the easy one: automate transfers so future-you is paid before present-you can spend. Friction on spending, zero friction on saving. Try the Behavioral Planner to lock funds into mental-accounting envelopes.`
  }
  if (has('bored', 'late night', 'sad', 'stress', 'reward')) {
    return `That's a Cue → Craving loop: boredom is the cue, the dopamine hit is the craving. Don't fight willpower — add friction to the Response. Unlink your saved cards so "buy" takes 5 annoying minutes. The Habit Loop canvas will map this for you.`
  }
  if (moodLow) {
    return `Let's regroup — your Rationality Score is running low at ${ctx.rationality}%. Whatever the decision, apply the one universal rule: introduce a delay. Urgency is the common ingredient in every trap. What specifically are you tempted by?`
  }
  return `Tell me the specific temptation and I'll diagnose the bias. As a rule: name the emotion the design is provoking (urgency? fear of loss? belonging?), then add a 24-hour delay. Your budget is ${money} and rationality ${ctx.rationality}% — let's keep both healthy.`
}

export function ProfNudge() {
  const { budget, rationality, startingBudget } = useNudge()
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      id: uid(),
      role: 'coach',
      text: "I'm Prof. Nudge. Tell me what you're tempted to buy or decide, and I'll diagnose the bias trying to hijack you. Tap a prompt below or type your own.",
    },
  ])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setInput('')
    setMessages((m) => [...m, { id: uid(), role: 'user', text: trimmed }])
    setTyping(true)
    const reply = respond(trimmed, { budget, rationality, startingBudget })
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), role: 'coach', text: reply }])
      setTyping(false)
    }, 650)
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-2xl transition-all hover:scale-105',
          open
            ? 'bg-zinc-800 text-zinc-200'
            : 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-zinc-950 shadow-emerald-500/30',
        )}
        aria-label="Open Prof. Nudge coach"
      >
        {open ? <X className="size-5" /> : <GraduationCap className="size-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Prof. Nudge'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-3 left-3 z-[90] mx-auto flex max-h-[70vh] w-auto max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:left-auto sm:right-5 sm:w-96 nudge-pop-in">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 p-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-50">Prof. Nudge</p>
              <p className="flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Behavioral coach · watching ${budget} budget
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto nudge-scroll p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex',
                  m.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed nudge-rise',
                    m.role === 'user'
                      ? 'rounded-br-sm bg-emerald-500/15 text-emerald-50'
                      : 'rounded-bl-sm bg-zinc-800 text-zinc-200',
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-zinc-800 px-3 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-zinc-500"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Presets */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-zinc-800 p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input)
              }}
              placeholder="Talk me out of a purchase…"
              className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 transition-all hover:bg-emerald-400 disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="flex items-center justify-center gap-1 pb-2 text-center text-[10px] text-zinc-600">
            <Sparkles className="size-2.5" /> Simulated coach · not financial advice
          </p>
        </div>
      )}
    </>
  )
}
