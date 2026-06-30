import type { Metadata } from 'next'
import { ScanLine } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { TrapScanner } from '@/components/trap-scanner'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Trap Scanner',
  description:
    'Drop in a checkout screenshot — or load the built-in example — and watch an animated scanner reveal every dark pattern with a counter-strategy.',
}

export default function TrapScannerPage() {
  return (
    <DashboardShell
      title="The Trap Scanner"
      subtitle="Reveal the dark patterns hiding in any interface"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={ScanLine}
          eyebrow="Dark-pattern detector"
          title="X-ray vision for manipulative design"
          description="The scanner sweeps an interface and flags each manipulation — anchoring, default bias, drip pricing — with a plain-English counter-strategy."
          accent="emerald"
        />
        <TrapScanner />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={ScanLine}
            eyebrow="The patterns it hunts"
            title="Know them, beat them"
            accent="amber"
          />
          <NudgeFeed slugs={['anchoring', 'default-bias', 'scarcity']} />
        </div>
      </div>
    </DashboardShell>
  )
}
