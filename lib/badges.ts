import type { LucideIcon } from 'lucide-react'
import {
  Gavel,
  ToggleRight,
  SplitSquareHorizontal,
  Flame,
  Salad,
  Landmark,
  Radar,
  Hourglass,
  Repeat,
  ScanLine,
  Brain,
  ShieldCheck,
} from 'lucide-react'

export type BadgeState = {
  rationality: number
  trapsAvoided: number
  trapsFallen: number
  decisions: number
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  hint: string
  /** Optional predicate evaluated against global state for auto-unlock. */
  auto?: (s: BadgeState) => boolean
}

export const BADGES: Badge[] = [
  {
    id: 'sunk-cost-slayer',
    name: 'Sunk-Cost Slayer',
    description: 'Walked away from the auction instead of throwing good money after bad.',
    icon: Gavel,
    hint: 'Fold the $20 auction before you bid (or somehow win it cheap) in the Impulse Lab.',
  },
  {
    id: 'default-bias-defeater',
    name: 'Default Killer',
    description: 'Turned off an auto-renew default before it could rob you.',
    icon: ToggleRight,
    hint: 'Flip Auto-Renewal OFF in the Subscription Trap.',
  },
  {
    id: 'frame-proof-analyst',
    name: 'Frame-Proof',
    description: 'Saw past the wording to the actual math. Words can\'t trick you.',
    icon: SplitSquareHorizontal,
    hint: 'Pick the scary "loss" option in the Framing test.',
  },
  {
    id: 'scarcity-skeptic',
    name: 'Timer Ignorer',
    description: 'Skipped the buy with a fake countdown screaming at you.',
    icon: Flame,
    hint: 'Skip the Hyper-Hype Sneakers with at least one trap turned on.',
  },
  {
    id: 'architect-of-good',
    name: 'Lunchroom Mastermind',
    description: 'Got people eating salads 40% more without banning a single fry.',
    icon: Salad,
    hint: 'Hit the +40% healthy goal by rearranging the cafeteria.',
  },
  {
    id: 'policy-whisperer',
    name: 'Big Brain Government',
    description: 'Hit 3+ national targets using only nudges. No laws needed.',
    icon: Landmark,
    hint: 'Brief the Cabinet in the Macro Lab with 3+ targets hit.',
  },
  {
    id: 'self-aware',
    name: 'Knows Their Own Brain',
    description: 'Finished the Bias Radar and saw exactly where they get tricked.',
    icon: Radar,
    hint: 'Answer all 10 questions in the Bias Radar.',
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Fast-forwarded a daily habit all the way to retirement.',
    icon: Hourglass,
    hint: 'Drag the Time Machine slider to age 60+.',
  },
  {
    id: 'habit-hacker',
    name: 'Loop Breaker',
    description: 'Jammed a friction point into a bad habit and watched it die.',
    icon: Repeat,
    hint: 'Add a friction step in the Habit Loop canvas.',
  },
  {
    id: 'trap-spotter',
    name: 'Trap Radar',
    description: 'Scanned a checkout and clocked every dirty trick in it.',
    icon: ScanLine,
    hint: 'Scan the example checkout in the Trap Scanner.',
  },
  {
    id: 'the-stoic',
    name: 'Built Different',
    description: 'Kept your Rationality at 90%+. Marketers hate you.',
    icon: Brain,
    hint: 'Keep making smart calls until rationality hits 90%+.',
    auto: (s) => s.rationality >= 90,
  },
  {
    id: 'iron-will',
    name: 'Unshakeable',
    description: 'Dodged 10 traps across the whole site. Cold-blooded.',
    icon: ShieldCheck,
    hint: 'Dodge 10 traps total across the simulators.',
    auto: (s) => s.trapsAvoided >= 10,
  },
]

export const badgeById = (id: string) => BADGES.find((b) => b.id === id)
