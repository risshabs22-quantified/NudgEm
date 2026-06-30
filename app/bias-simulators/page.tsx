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
    'Drag sliders on the stuff you forget to cancel. Then see what a decade of auto-renew actually costs you.',
}

export default function BiasSimulatorsPage() {
  return (
    <DashboardShell
      title="Bias Simulators"
      subtitle="Forgotten subs and sneaky wording"
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <SectionHeader
            icon={ToggleRight}
            eyebrow="Calculator"
            title="The Subscription Trap"
            description="Those $9.99 charges you never think about? Drag the sliders and watch ten years of them stack up."
            accent="amber"
          />
          <SubscriptionCalculator />
        </section>

        <section className="space-y-4">
          <SectionHeader
            icon={SplitSquareHorizontal}
            eyebrow="Quick test"
            title="The Framing Effect"
            description="Same money, two ways of saying it. Pick one and see which frame most people fall for."
            accent="sky"
          />
          <FramingTest />
        </section>

        <section className="space-y-4">
          <SectionHeader
            icon={SlidersHorizontal}
            eyebrow="Background"
            title="What's going on under the hood"
            accent="violet"
          />
          <NudgeFeed slugs={['default-bias', 'framing', 'decoy-effect']} />
        </section>
      </div>
    </DashboardShell>
  )
}
