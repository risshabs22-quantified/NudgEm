'use client'

import * as React from 'react'

export type RadarAxis = { axis: string; value: number; short?: string }

/**
 * Dependency-free SVG radar / spider chart. Values are 0–100.
 * Fully responsive via viewBox; labels auto-anchor around the perimeter.
 */
export function SpiderChart({
  data,
  size = 340,
  accent = '#3fb950',
}: {
  data: RadarAxis[]
  size?: number
  accent?: string
}) {
  const n = data.length
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 58 // leave room for labels
  const rings = [0.25, 0.5, 0.75, 1]

  const angleFor = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const pointFor = (i: number, r: number) => {
    const a = angleFor(i)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  }

  const ringPolygon = (factor: number) =>
    data
      .map((_, i) => {
        const [x, y] = pointFor(i, R * factor)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')

  const dataPolygon = data
    .map((d, i) => {
      const [x, y] = pointFor(i, R * (Math.max(0, Math.min(100, d.value)) / 100))
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full"
      role="img"
      aria-label="Behavioral profile radar chart"
    >
      {/* Rings */}
      {rings.map((f) => (
        <polygon
          key={f}
          points={ringPolygon(f)}
          fill="none"
          stroke="rgba(92,70,58,0.35)"
          strokeWidth={1}
        />
      ))}

      {/* Axes + labels */}
      {data.map((d, i) => {
        const [ex, ey] = pointFor(i, R)
        const [lx, ly] = pointFor(i, R + 26)
        const anchor =
          Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'
        return (
          <g key={d.axis}>
            <line
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="rgba(92,70,58,0.3)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-zinc-400"
              fontSize={11}
              fontWeight={600}
            >
              {d.short ?? d.axis}
            </text>
            <text
              x={lx}
              y={ly + 13}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill={accent}
              fontSize={10}
              fontFamily="monospace"
            >
              {Math.round(d.value)}
            </text>
          </g>
        )
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill={accent}
        fillOpacity={0.18}
        stroke={accent}
        strokeWidth={2}
        style={{ transition: 'all 0.5s ease' }}
      />
      {data.map((d, i) => {
        const [x, y] = pointFor(
          i,
          R * (Math.max(0, Math.min(100, d.value)) / 100),
        )
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.5}
            fill={accent}
            stroke="#0d1117"
            strokeWidth={1.5}
          />
        )
      })}
    </svg>
  )
}
