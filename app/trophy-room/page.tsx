import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard-shell'
import { TrophyRoom } from '@/components/trophy-room'

export const metadata: Metadata = {
  title: 'The Cognitive Master Room',
  description:
    'Your trophy cabinet and behavioral analytics — 12 badges tied to real performance across every NudgeEm simulator.',
}

export default function TrophyRoomPage() {
  return (
    <DashboardShell
      title="The Cognitive Master Room"
      subtitle="Achievements & behavioral analytics"
    >
      <TrophyRoom />
    </DashboardShell>
  )
}
