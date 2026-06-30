import type { LucideIcon } from 'lucide-react'
import {
  Scale,
  Layers,
  Clock,
  Anchor,
  Flame,
  ToggleRight,
  SplitSquareHorizontal,
  Magnet,
  History,
} from 'lucide-react'

export type Concept = {
  slug: string
  name: string
  icon: LucideIcon
  tagline: string
  definition: string
  /** A short, concrete "this is how it gets you" example. */
  example: string
  /** The economic / numeric breakdown. */
  breakdown: string
  /** How to defend yourself. */
  defense: string
  accent: 'emerald' | 'amber' | 'rose' | 'sky' | 'violet'
}

export const concepts: Concept[] = [
  {
    slug: 'loss-aversion',
    name: 'Loss Aversion',
    icon: Scale,
    tagline: 'Losses hurt ~2x more than equal gains feel good.',
    definition:
      'People are wired to avoid losses far more strongly than they pursue equivalent gains. The pain of losing $100 outweighs the joy of gaining $100.',
    example:
      '"Don\'t lose your streak!" and "Your cart is about to expire" both weaponize the fear of losing something you never really had.',
    breakdown:
      'Psychologically, a $100 loss ≈ the emotional weight of a $200 gain. The loss/gain coefficient is roughly 2.0 (Kahneman & Tversky).',
    defense:
      'Reframe every "loss" as a neutral choice. Ask: "Would I actively pay for this right now?" If not, there is no real loss in walking away.',
    accent: 'rose',
  },
  {
    slug: 'anchoring',
    name: 'Anchoring Effect',
    icon: Anchor,
    tagline: 'The first number you see warps every number after it.',
    definition:
      'We lean heavily on the first piece of information offered (the "anchor") when making decisions, even when it is arbitrary or irrelevant.',
    example:
      'A "was $250, now $99" sneaker feels like a steal — because $250 anchored your sense of value before you ever judged $99.',
    breakdown:
      'Strike-through pricing can lift perceived value by 20–40%. The "discount" is engineered backward from the price they always wanted.',
    defense:
      'Ignore the anchor entirely. Decide the maximum you\'d pay before seeing the price tag, then compare.',
    accent: 'amber',
  },
  {
    slug: 'scarcity',
    name: 'Scarcity Mindset',
    icon: Flame,
    tagline: '"Only 2 left!" hijacks your prefrontal cortex.',
    definition:
      'Perceived scarcity (limited stock, ticking timers) triggers urgency that bypasses rational evaluation and inflates desire.',
    example:
      'Countdown timers and "Only 2 left in stock!" badges manufacture panic so you buy before you think.',
    breakdown:
      'Artificial scarcity can boost conversion by 30%+. The timer usually resets when you reload — the scarcity is fake.',
    defense:
      'Treat urgency as a red flag, not a feature. A good decision is still good in 24 hours. Sleep on it.',
    accent: 'rose',
  },
  {
    slug: 'default-bias',
    name: 'Default Bias',
    icon: ToggleRight,
    tagline: 'Whatever is pre-checked is what you’ll keep.',
    definition:
      'People overwhelmingly stick with the default option, because changing it requires effort and feels like an active decision.',
    example:
      'Auto-renew is on by default. The free trial silently becomes a $14.99/mo charge you forget for 9 months.',
    breakdown:
      'Defaults can drive 80–90% of outcomes (e.g. organ-donation opt-in vs opt-out studies). One forgotten $15/mo default = $180/yr.',
    defense:
      'Audit every auto-renewal quarterly. Default everything to OFF and re-opt-in only what you actively use.',
    accent: 'amber',
  },
  {
    slug: 'framing',
    name: 'Framing Effect',
    icon: SplitSquareHorizontal,
    tagline: 'Same math, different words, opposite choice.',
    definition:
      'The way a choice is worded — as a gain or a loss — changes the decision, even when the underlying outcome is identical.',
    example:
      '"Keep $200" vs "Lose $400" of $600 are mathematically identical, yet most people pick the "keep" frame.',
    breakdown:
      'In Tversky & Kahneman\'s experiments, ~72% chose the option framed as a gain vs ~22% for the identical loss frame.',
    defense:
      'Restate every offer in raw numbers. Strip the adjectives and compare the actual dollars and outcomes.',
    accent: 'sky',
  },
  {
    slug: 'hyperbolic-discounting',
    name: 'Hyperbolic Discounting',
    icon: Clock,
    tagline: 'We wildly over-value reward right now.',
    definition:
      'We prefer smaller rewards now over larger rewards later, discounting the future steeply and inconsistently.',
    example:
      '"$50 now" beats "$60 in a month" for most people — an implied >200% annual interest rate to wait.',
    breakdown:
      '$5/day skipped and invested at 7% ≈ $26,000 in 10 years. Present bias makes that future invisible.',
    defense:
      'Automate the future: pay your savings/investments first, before the "now" brain can spend it.',
    accent: 'emerald',
  },
  {
    slug: 'choice-overload',
    name: 'Choice Overload',
    icon: Layers,
    tagline: 'Too many options → worse decisions (or none).',
    definition:
      'When faced with too many options, people experience decision paralysis, lower satisfaction, and often defer to the easy/default path.',
    example:
      '24 jam flavors get more lookers but fewer buyers than 6. Endless tiers push you to the "most popular" (most profitable) one.',
    breakdown:
      'Iyengar & Lepper: 6 options → 30% bought; 24 options → only 3% bought. More choice, less action.',
    defense:
      'Pre-commit to your criteria, then pick the first option that meets them. Don\'t maximize — satisfice.',
    accent: 'violet',
  },
  {
    slug: 'decoy-effect',
    name: 'Decoy Effect',
    icon: Magnet,
    tagline: 'A bad third option steers you to the “target”.',
    definition:
      'Adding a deliberately inferior option (the decoy) makes a nearby option look dramatically better, steering your choice.',
    example:
      'Small $3 / Large $7 → add a Medium $6.50 decoy and suddenly Large feels like a bargain.',
    breakdown:
      'The classic Economist subscription test: a useless print-only tier lifted choice of the pricey combo from 32% to 84%.',
    defense:
      'Ask what YOU actually need, not which option "wins" the comparison. Ignore the obviously-bad bait.',
    accent: 'violet',
  },
  {
    slug: 'sunk-cost',
    name: 'Sunk Cost Fallacy',
    icon: History,
    tagline: 'Throwing good money after bad.',
    definition:
      'We keep investing in something because of what we\'ve already spent, even when stopping is clearly the better choice.',
    example:
      '"I\'ve already spent $80 on skins, might as well keep playing/paying" — the $80 is gone either way.',
    breakdown:
      'Past spend is irrecoverable and should weigh 0 in future decisions. Only future costs vs future value matter.',
    defense:
      'Ask: "Knowing nothing about the past, would I start this today?" If no, stop now.',
    accent: 'rose',
  },
]

export const conceptBySlug = (slug: string) =>
  concepts.find((c) => c.slug === slug)

/** Tailwind class fragments keyed by accent, so cards stay consistent. */
export const accentClasses: Record<
  Concept['accent'],
  { text: string; ring: string; bg: string; glow: string; dot: string }
> = {
  emerald: {
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  amber: {
    text: 'text-amber-400',
    ring: 'ring-amber-500/30',
    bg: 'bg-amber-500/10',
    glow: 'shadow-amber-500/20',
    dot: 'bg-amber-400',
  },
  rose: {
    text: 'text-rose-400',
    ring: 'ring-rose-500/30',
    bg: 'bg-rose-500/10',
    glow: 'shadow-rose-500/20',
    dot: 'bg-rose-400',
  },
  sky: {
    text: 'text-sky-400',
    ring: 'ring-sky-500/30',
    bg: 'bg-sky-500/10',
    glow: 'shadow-sky-500/20',
    dot: 'bg-sky-400',
  },
  violet: {
    text: 'text-violet-400',
    ring: 'ring-violet-500/30',
    bg: 'bg-violet-500/10',
    glow: 'shadow-violet-500/20',
    dot: 'bg-violet-400',
  },
}
