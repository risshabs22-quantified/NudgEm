import type { Metadata } from 'next'
import { Wallet, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { BehavioralPlanner } from '@/components/behavioral-planner'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Behavioral Planner',
  description:
    'A real budgeting tool with built-in nudge protocols — friction holds and mental-accounting envelopes — that forecast ~15% more saved each month.',
}

export default function PlannerPage() {
  return (
    <DashboardShell
      title="The Behavioral Planner"
      subtitle="Budgeting, upgraded with behavioral friction"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Wallet}
          eyebrow="Real-world utility"
          title="Budget the way your brain actually works"
          description="Enter your real numbers, then switch on nudge protocols — a 24-hour friction hold and locked mental-accounting envelopes — and watch your forecast climb."
          accent="emerald"
        />
        <BehavioralPlanner />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science"
            title="Why friction protects your money"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'hyperbolic-discounting', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
