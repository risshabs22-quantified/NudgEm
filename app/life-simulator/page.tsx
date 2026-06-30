import type { Metadata } from 'next'
import { Hourglass } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { LifeSimulator } from '@/components/life-simulator'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Life Simulator',
  description:
    'Ten years of money decisions in about ten minutes. Hesitate and the tempting default picks for you.',
}

export default function LifeSimulatorPage() {
  return (
    <DashboardShell
      title="The Life Simulator"
      subtitle="Ten years of choices, one clock"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Hourglass}
          eyebrow="Life sim"
          title="Ten years. One clock. Every trap."
          description="You start at 18 with $1,000. Each year throws a money decision at you — and if you freeze, the easy (usually bad) choice wins automatically."
          accent="emerald"
        />
        <LifeSimulator />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Hourglass}
            eyebrow="After the run"
            title="Why each year was a setup"
            accent="violet"
          />
          <NudgeFeed
            slugs={['hyperbolic-discounting', 'sunk-cost', 'loss-aversion']}
          />
        </div>
      </div>
    </DashboardShell>
  )
}
