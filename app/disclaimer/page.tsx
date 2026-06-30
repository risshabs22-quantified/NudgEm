import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { LegalArticle, LegalSection } from '@/components/legal-shell'

export const metadata: Metadata = {
  title: 'Educational Disclaimer',
  description:
    'NudgeEm is an educational simulation. It is not financial, investment, medical, or legal advice.',
}

export default function DisclaimerPage() {
  return (
    <DashboardShell
      title="Educational Disclaimer"
      subtitle="Read this before you take any of it literally"
    >
      <LegalArticle
        icon={AlertTriangle}
        eyebrow="Important"
        title="Educational Disclaimer"
        updated="June 29, 2026"
        intro="NudgeEm exists to make behavioral economics tangible. To do that it uses simplified, illustrative models — not precise forecasts of your real life."
      >
        <LegalSection heading="Not financial or investment advice">
          <p>
            The 10% compounding assets, 7% investment returns, portfolio
            “recoveries”, and all figures shown in the Life Simulator and
            calculators are illustrative constants chosen to demonstrate a
            concept. Real markets are uncertain and can lose value. Nothing here
            is a recommendation to buy, sell, or hold any asset.
          </p>
        </LegalSection>

        <LegalSection heading="Not medical or policy advice">
          <p>
            The Macro Lab&apos;s organ-donation, carbon, healthcare, and savings
            figures are simulated for teaching purposes. They approximate the
            direction and scale of well-documented nudge effects but are not
            exact statistics for any country or program.
          </p>
        </LegalSection>

        <LegalSection heading="Simulations are simplified">
          <p>
            Behavioral effects are rendered as clean numbers so the lesson is
            legible. Real human behavior is messier, context-dependent, and
            varies between individuals. Your results in NudgeEm do not measure
            your intelligence, character, or financial competence.
          </p>
        </LegalSection>

        <LegalSection heading="The research behind it">
          <p>
            The concepts demonstrated — loss aversion, anchoring, framing,
            hyperbolic discounting, default bias, the sunk-cost fallacy, the
            dollar auction, and others — are drawn from the published work of
            behavioral economists and psychologists including Daniel Kahneman,
            Amos Tversky, Richard Thaler, Cass Sunstein, and Martin Shubik. We
            summarize their findings; we do not speak for them.
          </p>
        </LegalSection>

        <LegalSection heading="Consult a professional">
          <p>
            For decisions about your money, health, or legal situation, consult a
            qualified professional who can account for your specific
            circumstances.
          </p>
        </LegalSection>
      </LegalArticle>
    </DashboardShell>
  )
}
