import type { LucideIcon } from 'lucide-react'

export function LegalArticle({
  icon: Icon,
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  updated: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          <Icon className="size-5" />
        </span>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-zinc-50">
          {title}
        </h2>
        <p className="mt-1 text-xs text-zinc-500">Last updated: {updated}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{intro}</p>
      </div>

      <div className="mt-6 space-y-6">{children}</div>
    </article>
  )
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h3 className="font-serif text-lg font-semibold text-zinc-50">{heading}</h3>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-400">
        {children}
      </div>
    </section>
  )
}
