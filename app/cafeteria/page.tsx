import type { Metadata } from 'next'
import { Salad, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { CafeteriaSandbox } from '@/components/cafeteria-sandbox'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Cafeteria Sandbox',
  description:
    'Rearrange a cafeteria line and get 40% more people eating salad — without banning a single fry.',
}

export default function CafeteriaPage() {
  return (
    <DashboardShell
      title="The Cafeteria Sandbox"
      subtitle="Nudge people without banning anything"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Salad}
          eyebrow="Lunch line"
          title="Get 40% more salads — ban nothing"
          description="Move food to eye level or tuck it in the back. Run diners through and watch where they grab without thinking."
          accent="emerald"
        />
        <CafeteriaSandbox />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Why it works"
            title="Placement beats willpower"
            accent="violet"
          />
          <NudgeFeed slugs={['choice-overload', 'default-bias', 'anchoring']} />
        </div>
      </div>
    </DashboardShell>
  )
}
