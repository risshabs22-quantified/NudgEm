import type { Metadata } from 'next'
import { Users, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { CommunityMap } from '@/components/community-map'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Community Herd Map',
  description:
    'See what percentage of visitors fall for each trap — a live look at herd mentality.',
}

export default function CommunityPage() {
  return (
    <DashboardShell
      title="The Community Herd Map"
      subtitle="What everyone else falls for"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Users}
          eyebrow="The herd"
          title="What the crowd keeps falling for"
          description="Blended community data plus your own choices. Useful to watch — but remember, the crowd is often wrong."
          accent="sky"
        />
        <CommunityMap />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Why"
            title="Why the crowd feels so convincing"
            accent="violet"
          />
          <NudgeFeed slugs={['scarcity', 'framing', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
