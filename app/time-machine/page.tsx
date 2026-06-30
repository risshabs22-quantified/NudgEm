import type { Metadata } from 'next'
import { Hourglass, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { TimeMachine } from '@/components/time-machine'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Time Machine',
  description:
    'Hyperbolic discounting, visualized: drag a daily impulse spend across the decades and watch what it becomes if invested at 8%.',
}

export default function TimeMachinePage() {
  return (
    <DashboardShell
      title="The Time Machine"
      subtitle="Hyperbolic discounting, made impossible to ignore"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Hourglass}
          eyebrow="Compounding visualizer"
          title="Your daily habit, fast-forwarded 50 years"
          description="Set a daily impulse spend and drag the age slider from 18 to 68. See the chasm between what you bought and what it could have become."
          accent="emerald"
        />
        <TimeMachine />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science"
            title="Why the future feels free"
            accent="violet"
          />
          <NudgeFeed slugs={['hyperbolic-discounting', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
