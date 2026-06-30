import type { Metadata } from 'next'
import { Repeat, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { HabitLoop } from '@/components/habit-loop'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Habit Loop Rewire Canvas',
  description:
    'Map a bad money habit, stick a friction point in the middle, and watch it fade over eight weeks.',
}

export default function HabitLoopPage() {
  return (
    <DashboardShell
      title="The Habit Loop Canvas"
      subtitle="Break a money habit on purpose"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Repeat}
          eyebrow="Habit loop"
          title="Break it where it's weakest"
          description="Cue → Craving → Response → Reward. Pick a bad spending habit and jam friction into the Response step. Watch it die off."
          accent="emerald"
        />
        <HabitLoop />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Why"
            title="The biases inside the loop"
            accent="violet"
          />
          <NudgeFeed slugs={['hyperbolic-discounting', 'default-bias', 'scarcity']} />
        </div>
      </div>
    </DashboardShell>
  )
}
