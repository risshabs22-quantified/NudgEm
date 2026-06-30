import type { Metadata } from 'next'
import { Repeat, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { HabitLoop } from '@/components/habit-loop'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Habit Loop Rewire Canvas',
  description:
    'Map a bad financial habit as a Cue → Craving → Response → Reward loop, then insert a friction point to break it.',
}

export default function HabitLoopPage() {
  return (
    <DashboardShell
      title="The Habit Loop Canvas"
      subtitle="Rewire a money habit by design"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Repeat}
          eyebrow="Behavioral modification"
          title="Break the loop where it's weakest"
          description="Cue → Craving → Response → Reward powers every habit. Pick a bad money habit and jam a friction point into the Response to watch the behavior fade."
          accent="emerald"
        />
        <HabitLoop />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science"
            title="The biases inside the loop"
            accent="violet"
          />
          <NudgeFeed slugs={['hyperbolic-discounting', 'default-bias', 'scarcity']} />
        </div>
      </div>
    </DashboardShell>
  )
}
