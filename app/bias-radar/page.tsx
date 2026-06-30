import type { Metadata } from 'next'
import { Radar } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { BiasRadar } from '@/components/bias-radar'
import { SectionHeader } from '@/components/section-header'

export const metadata: Metadata = {
  title: 'The Bias Radar',
  description:
    "Ten quick money questions. See where your brain gets played — and download your profile when you're done.",
}

export default function BiasRadarPage() {
  return (
    <DashboardShell
      title="The Bias Radar"
      subtitle="Find out where you get played"
    >
      <div className="space-y-8">
        <SectionHeader
          icon={Radar}
          eyebrow="Quiz"
          title="Where do your weak spots live?"
          description="Ten fast trade-offs. We plot your answers on five axes and hand you a profile you can download."
          accent="violet"
        />
        <BiasRadar />
      </div>
    </DashboardShell>
  )
}
