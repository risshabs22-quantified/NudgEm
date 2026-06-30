import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard-shell'
import { TrophyRoom } from '@/components/trophy-room'

export const metadata: Metadata = {
  title: 'The Cognitive Master Room',
  description:
    "Badges and stats from every simulator — proof of how gullible (or sharp) you've been.",
}

export default function TrophyRoomPage() {
  return (
    <DashboardShell
      title="The Cognitive Master Room"
      subtitle="Badges and your track record"
    >
      <TrophyRoom />
    </DashboardShell>
  )
}
