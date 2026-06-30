import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  accent = 'emerald',
  className,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  description?: string
  accent?: 'emerald' | 'amber' | 'rose' | 'sky' | 'violet'
  className?: string
}) {
  const accentText: Record<string, string> = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    sky: 'text-sky-400',
    violet: 'text-violet-400',
  }
  const accentBg: Record<string, string> = {
    emerald: 'bg-emerald-500/10 ring-emerald-500/30',
    amber: 'bg-amber-500/10 ring-amber-500/30',
    rose: 'bg-rose-500/10 ring-rose-500/30',
    sky: 'bg-sky-500/10 ring-sky-500/30',
    violet: 'bg-violet-500/10 ring-violet-500/30',
  }

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl ring-1',
          accentBg[accent],
          accentText[accent],
        )}
      >
        <Icon className="size-5.5" strokeWidth={2.25} />
      </span>
      <div>
        <p
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.18em]',
            accentText[accent],
          )}
        >
          {eyebrow}
        </p>
        <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  )
}
