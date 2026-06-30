'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  SlidersHorizontal,
  Brain,
  Menu,
  X,
  RotateCcw,
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
        desc: 'Your overview',
      },
      {
        href: '/trophy-room',
        label: 'Master Room',
        icon: Trophy,
        desc: 'Badges & stats',
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
        desc: 'Checkout tricks & auction',
      },
      {
        href: '/life-simulator',
        label: 'Life Simulator',
        icon: Hourglass,
        desc: 'Ten years in ten minutes',
      },
      {
        href: '/bias-simulators',
        label: 'Bias Simulators',
        icon: SlidersHorizontal,
        desc: 'Subs & framing test',
      },
      {
        href: '/macro-lab',
        label: 'Macro Lab',
        icon: Landmark,
        desc: 'Nudge a whole country',
      },
      {
        href: '/cafeteria',
        label: 'Cafeteria Sandbox',
        icon: Salad,
        desc: 'Rearrange the lunch line',
      },
      {
        href: '/time-machine',
        label: 'Time Machine',
        icon: Hourglass,
        desc: 'See compounding in action',
      },
      {
        href: '/habit-loop',
        label: 'Habit Loop',
        icon: Repeat,
        desc: 'Break a bad habit',
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
        desc: 'Budget with friction',
      },
      {
        href: '/bias-radar',
        label: 'Bias Radar',
        icon: Radar,
        desc: 'Find your weak spots',
      },
      {
        href: '/trap-scanner',
        label: 'Trap Scanner',
        icon: ScanLine,
        desc: 'Spot checkout tricks',
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
        desc: 'Bias cards & case studies',
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
      <Link
        href="/"
        className="group flex items-center gap-3 border-b border-zinc-800 px-5 py-4"
        aria-label="NudgeEm home"
      >
        <div className="relative size-9 overflow-hidden rounded-md ring-1 ring-zinc-700 transition-transform group-hover:scale-105">
          <Image
            src="/logo.png"
            alt="NudgeEm logo"
            fill
            sizes="36px"
            className="object-cover"
            priority
          />
        </div>
        <div className="leading-tight">
          <div className="font-serif text-base font-semibold tracking-tight text-zinc-50">
            Nudge<span className="text-emerald-400">Em</span>
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            Behavioral Lab
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto nudge-scroll px-2.5 py-4">
        {NAV.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && 'mt-5')}>
            {group.heading && (
              <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                {group.heading}
              </p>
            )}
            <div className="space-y-px">
              {group.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 border-l-2 py-2 pl-3.5 pr-2.5 text-sm transition-colors',
                      active
                        ? 'border-emerald-500 bg-zinc-800/50 text-zinc-50'
                        : 'border-transparent text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        active
                          ? 'text-emerald-400'
                          : 'text-zinc-500 group-hover:text-zinc-300',
                      )}
                      strokeWidth={2.25}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium leading-tight">
                        {item.label}
                      </span>
                      <span className="block truncate text-[11px] leading-tight text-zinc-600">
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
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
          NudgeEm is a learning sandbox. No real money — just your instincts
          getting tested.
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
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-800 bg-zinc-950 lg:block">
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
        <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3.5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <Link
                href="/"
                aria-label="NudgeEm home"
                className="relative size-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-zinc-700 lg:hidden"
              >
                <Image
                  src="/logo.png"
                  alt="NudgeEm logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate font-serif text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-xs text-zinc-500">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="lg:max-w-md lg:flex-1">
              <MetricTicker />
            </div>
          </div>
        </header>

        <main className="relative px-5 py-10 sm:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      {/* Global overlays */}
      <BadgeToaster />
    </div>
  )
}
