import type { Metadata } from 'next'
import { Landmark, Brain } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { PolicySandbox } from '@/components/policy-sandbox'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Macro Lab',
  description:
    'Macro-nudging mode: act as a government economic advisor and hit national targets using only choice architecture — no bans, no mandates.',
}

export default function MacroLabPage() {
  return (
    <DashboardShell
      title="The Macro Lab"
      subtitle="Policy Sandbox — nudge an entire nation"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Landmark}
          eyebrow="Macro-nudging mode"
          title="Move millions by changing one default"
          description="You're the government's behavioral economist. Hit public-health, green, and savings targets using nudges alone — and watch the macro charts respond live."
          accent="sky"
        />
        <PolicySandbox />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Brain}
            eyebrow="The science behind the levers"
            title="Why defaults rule populations"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'loss-aversion', 'choice-overload']} />
        </div>
      </div>
    </DashboardShell>
  )
}
