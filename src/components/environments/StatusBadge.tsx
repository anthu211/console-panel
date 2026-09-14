import type { EnvironmentStatus } from '@/data/environments'
import { cn } from '@/lib/utils'

// Suspended deliberately avoids the amber used by FreshnessBadge's "Stale" state —
// Suspended is an intentional operational status, not a health/severity warning,
// so it shouldn't read as "something's wrong" next to a genuinely stale badge.
const statusColor: Record<EnvironmentStatus, string> = {
  Active: 'bg-[#31A56D]',
  Provisioning: 'bg-[#8F8DDE]',
  Suspended: 'bg-[#4C6FA3]',
  Purged: 'bg-shell-muted',
}

const statusText: Record<EnvironmentStatus, string> = {
  Active: 'text-shell-text',
  Provisioning: 'text-shell-text',
  Suspended: 'text-shell-text',
  Purged: 'text-shell-muted',
}

/** Status = colored dot + label, per spec (not a filled badge — status here is operational, not severity). */
export function StatusBadge({ status }: { status: EnvironmentStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[12px] font-medium', statusText[status])}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', statusColor[status])} aria-hidden="true" />
      {status}
    </span>
  )
}
