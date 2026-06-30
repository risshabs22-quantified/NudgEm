import type { Metadata } from 'next'
import { Hourglass, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { TimeMachine } from '@/components/time-machine'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Time Machine',
  description:
    'Drag a daily coffee habit across the decades. See what it becomes if you invested it instead.',
}

export default function TimeMachinePage() {
  return (
    <DashboardShell
      title="The Time Machine"
      subtitle="What your daily habit actually costs you"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Hourglass}
          eyebrow="Compounding"
          title="Your daily habit, fast-forwarded"
          description="Set a daily spend and drag the age slider. Watch the gap between what you bought and what you could've had."
          accent="emerald"
        />
        <TimeMachine />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Why"
            title="Why the future feels free"
            accent="violet"
          />
          <NudgeFeed slugs={['hyperbolic-discounting', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
