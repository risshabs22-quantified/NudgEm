import type { Metadata } from 'next'
import { Users, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { CommunityMap } from '@/components/community-map'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Community Herd Map',
  description:
    'See what percentage of NudgeEm visitors fall for each behavioral trap — a live lesson in Social Proof and Herd Mentality.',
}

export default function CommunityPage() {
  return (
    <DashboardShell
      title="The Community Herd Map"
      subtitle="Social proof, visualized"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Users}
          eyebrow="Herd mentality map"
          title="What the crowd falls for"
          description="A blended view of community data and your own live choices. Watching the herd is instructive — and a trap in itself."
          accent="sky"
        />
        <CommunityMap />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science"
            title="Why the crowd is so persuasive"
            accent="violet"
          />
          <NudgeFeed slugs={['scarcity', 'framing', 'loss-aversion']} />
        </div>
      </div>
    </DashboardShell>
  )
}
