import type { Metadata } from 'next'
import { Landmark, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { PolicySandbox } from '@/components/policy-sandbox'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Macro Lab',
  description:
    "You're the government's nudge guy. Hit national targets without banning anything — just change the defaults.",
}

export default function MacroLabPage() {
  return (
    <DashboardShell
      title="The Macro Lab"
      subtitle="Run a country with nudges, not laws"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Landmark}
          eyebrow="Macro mode"
          title="Move millions by changing one default"
          description="You're the behavioral economist for a whole country. Hit health, green, and savings targets using nudges only — no bans."
          accent="sky"
        />
        <PolicySandbox />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="Background"
            title="Why defaults run the world"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'loss-aversion', 'choice-overload']} />
        </div>
      </div>
    </DashboardShell>
  )
}
