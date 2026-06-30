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
  const accentBar: Record<string, string> = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    violet: 'bg-violet-500',
  }

  return (
    <div className={cn('border-b border-zinc-800 pb-3', className)}>
      <div className="flex items-center gap-2.5">
        <span className={cn('h-3.5 w-px', accentBar[accent])} />
        <Icon className={cn('size-4', accentText[accent])} strokeWidth={2.25} />
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.22em]',
            accentText[accent],
          )}
        >
          {eyebrow}
        </span>
      </div>
      <div className="mt-2.5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-[1.65rem]">
          {title}
        </h2>
        {description && (
          <p className="max-w-md text-sm leading-relaxed text-zinc-400 sm:text-right">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
