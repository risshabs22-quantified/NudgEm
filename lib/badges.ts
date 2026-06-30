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
    description: 'Walked away from the Escalation Pit without overbidding.',
    icon: Gavel,
    hint: 'Fold the dollar auction before you bid (or at a profit) in the Impulse Lab.',
  },
  {
    id: 'default-bias-defeater',
    name: 'Default-Bias Defeater',
    description: 'Switched off an auto-renewal default.',
    icon: ToggleRight,
    hint: 'Turn Auto-Renewal OFF in the Subscription Trap calculator.',
  },
  {
    id: 'frame-proof-analyst',
    name: 'Frame-Proof Analyst',
    description: 'Saw through the loss frame to the identical math.',
    icon: SplitSquareHorizontal,
    hint: 'Pick the loss-framed option in the Framing Effect A/B test.',
  },
  {
    id: 'scarcity-skeptic',
    name: 'Scarcity Skeptic',
    description: 'Resisted an impulse buy while triggers were live.',
    icon: Flame,
    hint: 'Skip the Hyper-Hype Sneakers with at least one trigger active.',
  },
  {
    id: 'architect-of-good',
    name: 'Architect of Good',
    description: 'Boosted healthy eating 40%+ in the Cafeteria Sandbox.',
    icon: Salad,
    hint: 'Hit the +40% healthy-choice goal by rearranging the cafeteria.',
  },
  {
    id: 'policy-whisperer',
    name: 'Policy Whisperer',
    description: 'Hit 3+ national targets with nudges alone.',
    icon: Landmark,
    hint: 'Brief the Cabinet in the Macro Lab with 3+ targets met.',
  },
  {
    id: 'self-aware',
    name: 'Know Thyself',
    description: 'Completed the Bias Radar diagnostic.',
    icon: Radar,
    hint: 'Finish all 10 questions in the Bias Radar.',
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Projected a habit all the way to retirement.',
    icon: Hourglass,
    hint: 'Drag the Time Machine slider to age 60 or beyond.',
  },
  {
    id: 'habit-hacker',
    name: 'Habit Hacker',
    description: 'Rewired a habit loop with a friction point.',
    icon: Repeat,
    hint: 'Insert a friction intervention in the Habit Loop canvas.',
  },
  {
    id: 'trap-spotter',
    name: 'Trap Spotter',
    description: 'Ran a full dark-pattern scan.',
    icon: ScanLine,
    hint: 'Scan the example checkout in the Trap Scanner.',
  },
  {
    id: 'the-stoic',
    name: 'The Stoic',
    description: 'Held a Rationality Score of 90% or higher.',
    icon: Brain,
    hint: 'Keep making rational choices to push rationality to 90%+.',
    auto: (s) => s.rationality >= 90,
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: 'Avoided 10 behavioral traps across the platform.',
    icon: ShieldCheck,
    hint: 'Resist 10 traps in total across all simulators.',
    auto: (s) => s.trapsAvoided >= 10,
  },
]

export const badgeById = (id: string) => BADGES.find((b) => b.id === id)
