'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  SlidersHorizontal,
  Brain,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  Hourglass,
  Landmark,
  Radar,
  ScanLine,
  Trophy,
  Salad,
  Repeat,
  Wallet,
  Users,
} from 'lucide-react'
import { MetricTicker } from '@/components/metric-ticker'
import { BadgeToaster } from '@/components/badge-toaster'
import { ProfNudge } from '@/components/prof-nudge'
import { useNudge } from '@/components/nudge-provider'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  desc: string
}

type NavGroup = { heading: string | null; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    heading: null,
    items: [
      {
        href: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        desc: 'Your behavioral overview',
      },
      {
        href: '/trophy-room',
        label: 'Master Room',
        icon: Trophy,
        desc: 'Badges & analytics',
      },
    ],
  },
  {
    heading: 'Simulations',
    items: [
      {
        href: '/impulse-lab',
        label: 'The Impulse Lab',
        icon: Zap,
        desc: 'Dark patterns & auction',
      },
      {
        href: '/life-simulator',
        label: 'Life Simulator',
        icon: Hourglass,
        desc: 'The 10-minute life run',
      },
      {
        href: '/bias-simulators',
        label: 'Bias Simulators',
        icon: SlidersHorizontal,
        desc: 'Defaults & framing',
      },
      {
        href: '/macro-lab',
        label: 'Macro Lab',
        icon: Landmark,
        desc: 'Nudge a whole nation',
      },
      {
        href: '/cafeteria',
        label: 'Cafeteria Sandbox',
        icon: Salad,
        desc: 'Choice architecture',
      },
      {
        href: '/time-machine',
        label: 'Time Machine',
        icon: Hourglass,
        desc: 'Compounding visualizer',
      },
      {
        href: '/habit-loop',
        label: 'Habit Loop',
        icon: Repeat,
        desc: 'Rewire a bad habit',
      },
    ],
  },
  {
    heading: 'Tools',
    items: [
      {
        href: '/planner',
        label: 'Behavioral Planner',
        icon: Wallet,
        desc: 'Budget with nudges',
      },
      {
        href: '/bias-radar',
        label: 'Bias Radar',
        icon: Radar,
        desc: 'Diagnose your profile',
      },
      {
        href: '/trap-scanner',
        label: 'Trap Scanner',
        icon: ScanLine,
        desc: 'Spot dark patterns',
      },
      {
        href: '/community',
        label: 'Community Map',
        icon: Users,
        desc: 'The herd, visualized',
      },
      {
        href: '/anatomy',
        label: 'Anatomy of a Choice',
        icon: Brain,
        desc: 'Concepts & case studies',
      },
    ],
  },
]

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { reset } = useNudge()

  // Close the mobile drawer whenever the route changes.
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const SidebarInner = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
          <Sparkles className="size-5 text-zinc-950" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="font-serif text-lg font-semibold tracking-tight text-zinc-50">
            Nudge<span className="text-emerald-400">Em</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Behavioral Lab
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto nudge-scroll px-3 py-2">
        {NAV.map((group, gi) => (
          <div key={gi} className="space-y-1">
            {group.heading && (
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                {group.heading}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                    active
                      ? 'bg-zinc-800/80 text-zinc-50 ring-1 ring-emerald-500/20'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 shadow-[0_0_12px_rgba(147,194,161,0.8)]" />
                  )}
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                      active
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-zinc-800/60 text-zinc-400 group-hover:text-zinc-200',
                    )}
                  >
                    <Icon className="size-4" strokeWidth={2.25} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {item.label}
                    </span>
                    <span className="block truncate text-[11px] text-zinc-500">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <RotateCcw className="size-4" />
          Reset Simulation
        </button>
        <p className="mt-3 px-2 text-center text-[10px] leading-relaxed text-zinc-600">
          NudgeEm is an educational sandbox. No real money is involved — only
          your behavioral instincts.
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-400">
            Privacy
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/terms" className="hover:text-zinc-400">
            Terms
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/disclaimer" className="hover:text-zinc-400">
            Disclaimer
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 nudge-grid-bg opacity-60" />
      <div className="pointer-events-none fixed -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-800 bg-zinc-950 lg:hidden nudge-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {SidebarInner}
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="relative lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
          <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-serif text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-xs text-zinc-500 sm:text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="lg:max-w-2xl lg:flex-1">
              <MetricTicker />
            </div>
          </div>
        </header>

        <main className="relative px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Global overlays */}
      <BadgeToaster />
      <ProfNudge />
    </div>
  )
}
