import type { Metadata } from 'next'
import { Radar } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { BiasRadar } from '@/components/bias-radar'
import { SectionHeader } from '@/components/section-header'

export const metadata: Metadata = {
  title: 'The Bias Radar',
  description:
    'A 10-question behavioral diagnostic that maps your susceptibility across Risk Aversion, Present Bias, Choice Fatigue, Scarcity, and Status Quo Bias — with a downloadable profile.',
}

export default function BiasRadarPage() {
  return (
    <DashboardShell
      title="The Bias Radar"
      subtitle="Map your personal behavioral profile"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Radar}
          eyebrow="Diagnostic audit"
          title="Where do your biases actually live?"
          description="Ten quick economic trade-offs. We plot your answers across five behavioral axes — then hand you a downloadable Behavioral Profile Résumé."
          accent="violet"
        />
        <BiasRadar />
      </div>
    </DashboardShell>
  )
}
