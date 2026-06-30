'use client'

import * as React from 'react'
import { Info, ChevronDown, ShieldCheck, BarChart3 } from 'lucide-react'
import { concepts, accentClasses, type Concept } from '@/lib/concepts'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function ConceptCard({ concept }: { concept: Concept }) {
  const [open, setOpen] = React.useState(false)
  const a = accentClasses[concept.accent]
  const Icon = concept.icon

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900',
        open && 'ring-1',
        open && a.ring,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-xl ring-1',
            a.bg,
            a.ring,
            a.text,
          )}
        >
          <Icon className="size-5" strokeWidth={2.25} />
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex size-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Quick definition"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-center">
              {concept.tagline}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h3 className="mt-3 font-serif text-base font-semibold text-zinc-50">
        {concept.name}
      </h3>
      <p className={cn('mt-0.5 text-xs font-medium', a.text)}>
        {concept.tagline}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">
        {concept.definition}
      </p>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
      >
        {open ? 'Hide it' : 'Break it down'}
        <ChevronDown
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="nudge-rise mt-3 space-y-3 border-t border-zinc-800 pt-3">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <span className="text-base leading-none">🎯</span> You've seen this when
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-300">
              {concept.example}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-800/40 p-2.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              <BarChart3 className="size-3" /> The math
            </p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-zinc-300">
              {concept.breakdown}
            </p>
          </div>
          <div
            className={cn(
              'rounded-lg p-2.5',
              accentClasses.emerald.bg,
            )}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="size-3" /> What to do
            </p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-100/90">
              {concept.defense}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function NudgeFeed({
  limit,
  slugs,
}: {
  limit?: number
  slugs?: string[]
}) {
  let list = concepts
  if (slugs) list = slugs.map((s) => concepts.find((c) => c.slug === s)!).filter(Boolean)
  if (limit) list = list.slice(0, limit)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((c) => (
        <ConceptCard key={c.slug} concept={c} />
      ))}
    </div>
  )
}
