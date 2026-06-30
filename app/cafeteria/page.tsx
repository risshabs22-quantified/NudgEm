import type { Metadata } from 'next'
import { Salad, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { CafeteriaSandbox } from '@/components/cafeteria-sandbox'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Cafeteria Sandbox',
  description:
    'Play Choice Architect: increase healthy eating 40% by rearranging a cafeteria — no bans, just salience bias.',
}

export default function CafeteriaPage() {
  return (
    <DashboardShell
      title="The Cafeteria Sandbox"
      subtitle="Choice architecture — nudge without banning"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Salad}
          eyebrow="Choice architecture designer"
          title="Increase healthy eating by 40% — ban nothing"
          description="You're the Choice Architect. Move food between eye level and the back of the line, then run real diners through and watch Salience Bias do the work."
          accent="emerald"
        />
        <CafeteriaSandbox />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science"
            title="Why placement beats willpower"
            accent="violet"
          />
          <NudgeFeed slugs={['choice-overload', 'default-bias', 'anchoring']} />
        </div>
      </div>
    </DashboardShell>
  )
}
