import { BookOpen } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { DashboardOverview } from '@/components/dashboard-overview'
import { DailyChallenge } from '@/components/daily-challenge'
import { LearningJourney } from '@/components/learning-journey'
import { ActivityLog } from '@/components/activity-log'
import { NudgeFeed } from '@/components/nudge-feed'
import { SectionHeader } from '@/components/section-header'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="How you're doing so far"
    >
      <div className="space-y-10">
        <DashboardOverview />
        <DailyChallenge />
        <LearningJourney />

        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <ActivityLog />
          <div className="space-y-4">
            <SectionHeader
              icon={BookOpen}
              eyebrow="Worth knowing"
              title="Three biases to know"
              description="Quick cards on how each trick works and how to dodge it. Tap one to go deeper."
              accent="violet"
            />
            <NudgeFeed
              slugs={[
                'loss-aversion',
                'choice-overload',
                'hyperbolic-discounting',
              ]}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
