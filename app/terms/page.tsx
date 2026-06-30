import type { Metadata } from 'next'
import { ScrollText } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { LegalArticle, LegalSection } from '@/components/legal-shell'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms governing your use of NudgeEm, an educational behavioral-economics simulator.',
}

export default function TermsPage() {
  return (
    <DashboardShell title="Terms of Use" subtitle="The rules of the sandbox">
      <LegalArticle
        icon={ScrollText}
        eyebrow="Legal"
        title="Terms of Use"
        updated="June 29, 2026"
        intro="By using NudgeEm you agree to these terms. NudgeEm is a free educational tool that teaches behavioral economics through interactive simulations."
      >
        <LegalSection heading="1. Educational purpose">
          <p>
            NudgeEm is provided for educational and entertainment purposes only.
            All money, scores, budgets, markets, and outcomes within the app are
            simulated. No real funds are ever spent, earned, transferred, or at
            risk.
          </p>
        </LegalSection>

        <LegalSection heading="2. Not professional advice">
          <p>
            Nothing in NudgeEm constitutes financial, investment, tax, medical,
            or legal advice. The simulations are simplified models of real
            phenomena and should not be relied upon for any actual decision. See
            our{' '}
            <span className="text-zinc-200">Disclaimer</span> for details.
          </p>
        </LegalSection>

        <LegalSection heading="3. Acceptable use">
          <p>
            You agree not to misuse the application, attempt to disrupt it, or use
            it for any unlawful purpose. The Trap Scanner is intended for
            analyzing interfaces you have the right to view; do not use it to
            infringe the rights of others.
          </p>
        </LegalSection>

        <LegalSection heading="4. Intellectual property">
          <p>
            The NudgeEm name, written content, and original code are the property
            of their respective authors and are made available under the license
            included with the source. The behavioral-economics concepts described
            (loss aversion, anchoring, etc.) are part of the public academic
            record and are credited to their originating researchers where noted.
          </p>
        </LegalSection>

        <LegalSection heading="5. “As is”, no warranty">
          <p>
            NudgeEm is provided “as is”, without warranties of any kind, express
            or implied. We do not guarantee that it will be accurate,
            uninterrupted, or error-free.
          </p>
        </LegalSection>

        <LegalSection heading="6. Limitation of liability">
          <p>
            To the fullest extent permitted by law, the authors are not liable for
            any damages arising from your use of, or inability to use, NudgeEm.
          </p>
        </LegalSection>

        <LegalSection heading="7. Changes">
          <p>
            We may update these terms over time. Continued use after an update
            constitutes acceptance of the revised terms.
          </p>
        </LegalSection>
      </LegalArticle>
    </DashboardShell>
  )
}
