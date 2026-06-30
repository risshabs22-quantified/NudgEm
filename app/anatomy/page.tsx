import type { Metadata } from 'next'
import { Brain, Library, BookMarked } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { NudgeFeed } from '@/components/nudge-feed'
import { CaseStudyVault } from '@/components/case-study-vault'
import { SectionHeader } from '@/components/section-header'
import { ActivityLog } from '@/components/activity-log'

export const metadata: Metadata = {
  title: 'The Anatomy of a Choice',
  description:
    'Nine biases that power almost every trick online — plus the famous experiments you can try yourself.',
}

export default function AnatomyPage() {
  return (
    <DashboardShell
      title="The Anatomy of a Choice"
      subtitle="The biases behind every trick"
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30">
              <Brain className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                The library
              </p>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-50">
                Every nudge is just a bias with a budget
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                These nine biases show up in almost every checkout, subscription,
                and sale page you'll ever see. Each card has a real example, the
                math behind it, and what to do. Tap{' '}
                <span className="font-medium text-zinc-200">Break it down</span>{' '}
                for the full story.
              </p>
            </div>
          </div>
        </div>

        <SectionHeader
          icon={Library}
          eyebrow="The full set"
          title="Nine biases, dissected"
          accent="violet"
        />
        <NudgeFeed />

        <div className="space-y-4 pt-2">
          <SectionHeader
            icon={BookMarked}
            eyebrow="The classics"
            title="The experiments that started it all"
            description="Short write-ups of the famous studies — with little widgets so you can run them on yourself."
            accent="violet"
          />
          <CaseStudyVault />
        </div>

        <div className="pt-2">
          <ActivityLog />
        </div>
      </div>
    </DashboardShell>
  )
}
