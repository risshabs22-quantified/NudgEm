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
    'A live dark-pattern checkout. Toggle scarcity timers, low-stock badges, and fake social proof — then see if you crack.',
}

export default function ImpulseLabPage() {
  return (
    <DashboardShell
      title="The Impulse Lab"
      subtitle="Live dark-pattern checkout simulator"
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
              <ShieldAlert className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-zinc-300">
              This is a <span className="font-semibold text-rose-300">safe replica</span>{' '}
              of the manipulation tactics real e-commerce sites use. Toggle the
              triggers, try to buy, and feel the pressure. Buying while triggers
              are active <span className="font-semibold">drops your Rationality
              Score</span> and drains your{' '}
              <span className="font-semibold">Psychological Budget</span>.
            </p>
          </div>
        </div>

        <SectionHeader
          icon={Zap}
          eyebrow="Interactive simulator"
          title="The 'Impulse Buy' dark pattern"
          description="Scarcity Mindset + Anchoring Effect, weaponized. Can you walk away?"
          accent="rose"
        />
        <ImpulseSimulator />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Gavel}
            eyebrow="Sunk cost mini-game"
            title="The Escalation Pit"
            description="Bid against an AI for a $20 bill — but the loser pays their bid too. Watch how far sunk cost drags you past rational."
            accent="rose"
          />
          <EscalationAuction />
        </div>

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={ShieldAlert}
            eyebrow="The biases at play"
            title="What just happened to your brain"
            accent="amber"
          />
          <NudgeFeed slugs={['scarcity', 'anchoring', 'sunk-cost']} />
        </div>
      </div>
    </DashboardShell>
  )
}
