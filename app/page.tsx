import { BookOpen } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { DashboardOverview } from '@/components/dashboard-overview'
import { ActivityLog } from '@/components/activity-log'
import { NudgeFeed } from '@/components/nudge-feed'
import { SectionHeader } from '@/components/section-header'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      subtitle="A live read-out of how nudge-proof you are"
    >
      <div className="space-y-8">
        <DashboardOverview />

        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <ActivityLog />
          <div className="space-y-4">
            <SectionHeader
              icon={BookOpen}
              eyebrow="Today's primer"
              title="Three biases to know"
              description="Bite-sized breakdowns. Tap a card to reveal the economics and your defense."
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
