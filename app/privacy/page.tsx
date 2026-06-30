import type { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { LegalArticle, LegalSection } from '@/components/legal-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How NudgeEm handles your data: everything stays in your browser. No accounts, no servers storing your activity.',
}

export default function PrivacyPage() {
  return (
    <DashboardShell title="Privacy Policy" subtitle="Your data stays with you">
      <LegalArticle
        icon={Shield}
        eyebrow="Legal"
        title="Privacy Policy"
        updated="June 29, 2026"
        intro="NudgeEm is a client-side educational application. It is designed so that your activity never leaves your device. This policy explains exactly what is — and is not — collected."
      >
        <LegalSection heading="1. What we store">
          <p>
            Your Rationality Score, Psychological Budget, decision ledger, and
            simulator progress are stored only in your browser&apos;s{' '}
            <span className="text-zinc-200">localStorage</span>. This data never
            leaves your device and is not transmitted to us or any third party.
          </p>
          <p>
            You can erase all of it at any time using the{' '}
            <span className="text-zinc-200">Reset Simulation</span> button in the
            sidebar, or by clearing your browser&apos;s site data.
          </p>
        </LegalSection>

        <LegalSection heading="2. Uploaded images">
          <p>
            The Trap Scanner can read a screenshot you drag in. That image is
            processed entirely in your browser to display it back to you — it is
            never uploaded, stored, or analyzed on any server. The reference to
            it is discarded as soon as you start a new scan or leave the page.
          </p>
        </LegalSection>

        <LegalSection heading="3. Accounts &amp; cookies">
          <p>
            NudgeEm has no user accounts, login, or registration. We do not set
            advertising or tracking cookies.
          </p>
        </LegalSection>

        <LegalSection heading="4. Analytics">
          <p>
            A production deployment may use privacy-friendly, aggregate analytics
            (Vercel Analytics) to count page views. This does not identify
            individuals and collects no personal information. It is disabled
            during local development.
          </p>
        </LegalSection>

        <LegalSection heading="5. Children's privacy">
          <p>
            NudgeEm is suitable for general audiences and collects no personal
            data from anyone, including minors.
          </p>
        </LegalSection>

        <LegalSection heading="6. Changes &amp; contact">
          <p>
            We may update this policy as the project evolves; the “Last updated”
            date above will change accordingly. Questions can be directed to the
            project maintainer via the project&apos;s public repository.
          </p>
        </LegalSection>
      </LegalArticle>
    </DashboardShell>
  )
}
