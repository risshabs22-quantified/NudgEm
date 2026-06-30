'use client'

import * as React from 'react'

/**
 * Smoothly animates a numeric value toward `target` for the live tickers.
 * Uses an easing rAF loop so big jumps feel like a "counter rolling".
 */
export function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = React.useState(target)
  const fromRef = React.useRef(target)
  const startRef = React.useRef<number | null>(null)
  const rafRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    fromRef.current = value
    startRef.current = null
    const from = fromRef.current
    const delta = target - from

    if (delta === 0) return

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + delta * eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
