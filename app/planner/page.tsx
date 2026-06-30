import type { Metadata } from 'next'
import { Wallet, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { BehavioralPlanner } from '@/components/behavioral-planner'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Behavioral Planner',
  description:
    'Plug in your real numbers, flip on a 24-hour hold or budget buckets, and see how much more you could save.',
}

export default function PlannerPage() {
  return (
    <DashboardShell
      title="The Behavioral Planner"
      subtitle="Budgeting that works with your brain, not against it"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Wallet}
          eyebrow="Your numbers"
          title="Budget like a normal person"
          description="Enter what you actually make and spend. Then turn on a 24-hour wait on impulse buys or split money into locked buckets — and watch the forecast jump."
          accent="emerald"
        />
        <BehavioralPlanner />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Why it works"
            title="Friction is your friend"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'hyperbolic-discounting', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
