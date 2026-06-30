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
    tagline: 'Losing $20 ruins your week. Finding $20 is just "neat."',
    definition:
      'Your brain treats losing something as way worse than gaining the same thing. Losing hurts about twice as hard as winning feels good. It is extremely dramatic about it.',
    example:
      '"Don\'t lose your streak!" on Snapchat and "your cart expires soon" both work the same way — they scare you about losing something you never even had.',
    breakdown:
      'The math: a $100 loss feels like a $200 gain in your head. The loss/gain ratio is about 2x (Kahneman & Tversky figured this out).',
    defense:
      'Rename every "loss" as just... not buying. Ask "would I actually pay for this right now?" If no, you lost nothing by walking.',
    accent: 'rose',
  },
  {
    slug: 'anchoring',
    name: 'Anchoring Effect',
    icon: Anchor,
    tagline: 'The first price you see poisons every price after it.',
    definition:
      'Whatever number you see first becomes the "anchor" your brain measures everything against — even when that number is completely made up.',
    example:
      'A sneaker that\'s "was $250, now $99" feels like a steal. It is not. They picked $250 first just so $99 would look like a gift.',
    breakdown:
      'That crossed-out price can boost how much you "value" something by 20–40%. The discount was reverse-engineered from the price they wanted all along.',
    defense:
      'Decide your max price BEFORE you look at the tag. Then ignore the anchor like it ghosted you.',
    accent: 'amber',
  },
  {
    slug: 'scarcity',
    name: 'Scarcity Mindset',
    icon: Flame,
    tagline: '"Only 2 left!" turns your brain completely off.',
    definition:
      'When something feels rare or about to run out, panic takes over and you stop thinking. Suddenly you NEED it. You did not need it 4 seconds ago.',
    example:
      'Countdown timers and "Only 2 left in stock!" badges on Shein and Temu exist to make you panic-buy before your common sense logs in.',
    breakdown:
      'Fake scarcity can bump sales by 30%+. Pro tip: reload the page. The timer resets. It was never real.',
    defense:
      'Urgency is a red flag, not a deal. A real good decision is still good tomorrow. Close the tab and sleep on it.',
    accent: 'rose',
  },
  {
    slug: 'default-bias',
    name: 'Default Bias',
    icon: ToggleRight,
    tagline: 'Whatever box is pre-checked is what you keep forever.',
    definition:
      'People just go with the default option because changing it is effort, and effort is the enemy. Companies know this and set the default to whatever makes them money.',
    example:
      'Free trial → auto-renew is ON by default → it quietly becomes $14.99/mo → you notice 9 months later. That\'s $135 for nothing.',
    breakdown:
      'Defaults decide 80–90% of outcomes (see opt-in vs opt-out organ donation). One forgotten $15/mo sub = $180 a year. For nothing.',
    defense:
      'Check your subscriptions every few months. Turn everything OFF by default and only turn back on what you actually use.',
    accent: 'amber',
  },
  {
    slug: 'framing',
    name: 'Framing Effect',
    icon: SplitSquareHorizontal,
    tagline: 'Same exact math. Different words. You pick differently.',
    definition:
      'How a choice is worded — as a win or a loss — flips your decision, even when the actual outcome is literally identical. Words hack you.',
    example:
      '"Keep $200" vs "Lose $400" out of $600 are the SAME thing. Most people still grab the "keep" one because "lose" makes them flinch.',
    breakdown:
      'In the Tversky & Kahneman study, ~72% picked the "gain" wording over the identical "loss" wording. Same money. Different vibes.',
    defense:
      'Translate every offer into raw numbers. Delete the adjectives. Then see if you still care.',
    accent: 'sky',
  },
  {
    slug: 'hyperbolic-discounting',
    name: 'Hyperbolic Discounting',
    icon: Clock,
    tagline: 'Now-you keeps robbing future-you. Now-you is a menace.',
    definition:
      'Your brain massively overrates getting stuff right now and basically ignores the future. Future-you is a stranger you do not care about.',
    example:
      'You\'d take "$50 today" over "$60 next month" without thinking. That\'s you paying a huge tax just to not wait.',
    breakdown:
      '$5/day (one iced coffee) invested at 7% is around $26,000 in 10 years. Present-you cannot see that number, so it spends it.',
    defense:
      'Make future-you win automatically: auto-move money to savings the second you get paid, before now-you can touch it.',
    accent: 'emerald',
  },
  {
    slug: 'choice-overload',
    name: 'Choice Overload',
    icon: Layers,
    tagline: 'Too many options = you pick nothing (or the worst one).',
    definition:
      'Give someone 500 options and their brain just crashes. They either give up or default to whatever\'s "most popular" (read: most profitable).',
    example:
      'Opening Netflix, scrolling for 30 minutes, then rewatching The Office for the 9th time. Or freezing on a 12-page menu and ordering your usual.',
    breakdown:
      'Iyengar & Lepper: 6 jam options → 30% bought. 24 options → only 3% bought. More choices, fewer decisions.',
    defense:
      'Decide what you actually want first, then grab the first option that clears the bar. Stop trying to find "the best one."',
    accent: 'violet',
  },
  {
    slug: 'decoy-effect',
    name: 'Decoy Effect',
    icon: Magnet,
    tagline: 'A trash third option exists just to push you to another.',
    definition:
      'Companies add a deliberately bad option so a different option suddenly looks like a no-brainer. The bad one was never meant to be picked.',
    example:
      'Small popcorn $4, Large $8... then a Medium $7.50 shows up and suddenly Large feels "worth it." That medium is bait.',
    breakdown:
      'The famous Economist test: adding a pointless print-only tier pushed people picking the expensive combo from 32% up to 84%.',
    defense:
      'Ask what YOU need, not which option "wins" the lineup. Ignore the obviously planted loser.',
    accent: 'violet',
  },
  {
    slug: 'sunk-cost',
    name: 'Sunk Cost Fallacy',
    icon: History,
    tagline: 'Throwing more money at something just because you already did.',
    definition:
      'You keep paying/playing because of what you ALREADY spent — even when quitting is obviously the smarter move. The past money is gone either way.',
    example:
      '"I already dropped $80 on Valorant skins, might as well keep buying the battle pass." The $80 is gone. Spending more doesn\'t bring it back.',
    breakdown:
      'Money you already spent should count for exactly $0 in your next decision. Only "future cost vs future value" matters.',
    defense:
      'Ask: "if I knew nothing about the past, would I start this today?" If no — stop. Right now.',
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
