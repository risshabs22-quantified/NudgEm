import type { Metadata } from 'next'
import { ScanLine, Shield } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { TrapScanner } from '@/components/trap-scanner'
import { ShieldSimulator } from '@/components/shield-simulator'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'The Trap Scanner',
  description:
    'Load a checkout screenshot or try our example. The scanner flags every trick and tells you what to do about it.',
}

export default function TrapScannerPage() {
  return (
    <DashboardShell
      title="The Trap Scanner"
      subtitle="Spot the tricks hiding in any checkout"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={ScanLine}
          eyebrow="Scanner"
          title="X-ray for shady checkout pages"
          description="Sweep an interface and it flags each trick — fake timers, inflated prices, pre-checked boxes — plus a plain fix for each one."
          accent="emerald"
        />
        <TrapScanner />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={Shield}
            eyebrow="Shield demo"
            title="What a honest checkout looks like"
            description="Flip the NudgeEm Shield on and off over a fake checkout. Watch the panic buttons turn into plain, boring facts."
            accent="emerald"
          />
          <ShieldSimulator />
        </div>

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={ScanLine}
            eyebrow="The hits"
            title="Know them, dodge them"
            accent="amber"
          />
          <NudgeFeed slugs={['anchoring', 'default-bias', 'scarcity']} />
        </div>
      </div>
    </DashboardShell>
  )
}
