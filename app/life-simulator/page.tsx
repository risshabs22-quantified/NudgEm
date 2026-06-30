import type { Metadata } from 'next'
import { Hourglass } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { LifeSimulator } from '@/components/life-simulator'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Life Simulator',
  description:
    'The 10-Minute Life Run — a real-time, choice-driven decade where every year throws a behaviorally-loaded money decision at you.',
}

export default function LifeSimulatorPage() {
  return (
    <DashboardShell
      title="The Life Simulator"
      subtitle="The 10-Minute Life Run — a decade of decisions in real time"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Hourglass}
          eyebrow="Accelerated life simulator"
          title="Ten years. One clock. Every bias."
          description="Start at 18 with $1,000. Each year delivers a decision wired with a behavioral trap — and the timer auto-picks the tempting default if you hesitate."
          accent="emerald"
        />
        <LifeSimulator />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Hourglass}
            eyebrow="The biases you just faced"
            title="Why each year was a trap"
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
