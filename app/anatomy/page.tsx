import type { Metadata } from 'next'
import { Brain, Library } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { NudgeFeed } from '@/components/nudge-feed'
import { SectionHeader } from '@/components/section-header'
import { ActivityLog } from '@/components/activity-log'

export const metadata: Metadata = {
  title: 'The Anatomy of a Choice',
  description:
    'A field guide to the nine core cognitive biases behind every nudge — with a concrete example, the economics, and your defense for each.',
}

export default function AnatomyPage() {
  return (
    <DashboardShell
      title="The Anatomy of a Choice"
      subtitle="A field guide to the biases behind every nudge"
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
                These nine biases power almost every dark pattern you'll meet
                online. Each card gives you a real-world example, the economics
                that make it profitable, and a concrete defense. Tap{' '}
                <span className="font-medium text-zinc-200">"Break it down"</span>{' '}
                to go deeper.
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

        <div className="pt-2">
          <ActivityLog />
        </div>
      </div>
    </DashboardShell>
  )
}
