import type { Metadata } from 'next'
import { Zap, ShieldAlert, Gavel } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { ImpulseSimulator } from '@/components/impulse-simulator'
import { EscalationAuction } from '@/components/escalation-auction'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Impulse Lab',
  description:
    'Fake checkout with countdown timers, low-stock badges, and bogus social proof. See if you can walk away.',
}

export default function ImpulseLabPage() {
  return (
    <DashboardShell
      title="The Impulse Lab"
      subtitle="Fake checkout, real pressure"
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
              <ShieldAlert className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-zinc-300">
              This is a <span className="font-semibold text-rose-300">safe copy</span>{' '}
              of the tricks real stores use. Flip the switches, try to buy, feel
              the squeeze. Buy with tricks on and your{' '}
              <span className="font-semibold">Rationality Score</span> drops and
              your <span className="font-semibold">Psychological Budget</span>{' '}
              takes a hit.
            </p>
          </div>
        </div>

        <SectionHeader
          icon={Zap}
          eyebrow="Try it"
          title="The fake impulse buy"
          description="Countdown timer, fake scarcity, inflated anchor price — the usual suspects. Can you close the tab?"
          accent="rose"
        />
        <ImpulseSimulator />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Gavel}
            eyebrow="Mini-game"
            title="The Escalation Pit"
            description="Bid against a bot for a $20 bill. Catch: the loser pays their bid too. See how far sunk cost pulls you past $20."
            accent="rose"
          />
          <EscalationAuction />
        </div>

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={ShieldAlert}
            eyebrow="What happened"
            title="The tricks you just ran into"
            accent="amber"
          />
          <NudgeFeed slugs={['scarcity', 'anchoring', 'sunk-cost']} />
        </div>
      </div>
    </DashboardShell>
  )
}
