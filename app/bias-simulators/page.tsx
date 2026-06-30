import type { Metadata } from 'next'
import { SlidersHorizontal, SplitSquareHorizontal, ToggleRight } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { SubscriptionCalculator } from '@/components/subscription-calculator'
import { FramingTest } from '@/components/framing-test'
import { SectionHeader } from '@/components/section-header'
import { NudgeFeed } from '@/components/nudge-feed'

export const metadata: Metadata = {
  title: 'Bias Simulators',
  description:
    'Model the compounding cost of forgotten subscription defaults, and run the framing A/B test on your own loss aversion.',
}

export default function BiasSimulatorsPage() {
  return (
    <DashboardShell
      title="Bias Simulators"
      subtitle="Default Bias & the Framing Effect, made tangible"
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <SectionHeader
            icon={ToggleRight}
            eyebrow="Interactive calculator"
            title="The Subscription Trap & Default Bias"
            description="Tiny auto-renewing charges are invisible by design. Drag the sliders and watch a decade compound."
            accent="amber"
          />
          <SubscriptionCalculator />
        </section>

        <section className="space-y-4">
          <SectionHeader
            icon={SplitSquareHorizontal}
            eyebrow="Interactive A/B test"
            title="The Framing Effect"
            description="Same dollars, two descriptions. Find out which version your brain prefers — and why."
            accent="sky"
          />
          <FramingTest />
        </section>

        <section className="space-y-4">
          <SectionHeader
            icon={SlidersHorizontal}
            eyebrow="The biases at play"
            title="The mechanics behind the sliders"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'framing', 'decoy-effect']} />
        </section>
      </div>
    </DashboardShell>
  )
}
