import { CheckCircle2, TriangleAlert } from 'lucide-react'
import type { Freshness } from '@/data/environments'
import { cn } from '@/lib/utils'

/**
 * Freshness signal — icon-first so it reads without relying on color alone
 * (colorblind-safe). Deliberately distinct from the "Last sync" timestamp column.
 */
export function FreshnessBadge({ freshness, className }: { freshness: Freshness; className?: string }) {
  const verified = freshness === 'Verified'
  const Icon = verified ? CheckCircle2 : TriangleAlert
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[12px] font-semibold',
        verified ? 'bg-[#EFF7ED] text-[#31A56D] dark:bg-[#192C15]' : 'bg-[#FEF3C7] text-[#D98B1D] dark:bg-[#514B09]',
        className,
      )}
      title={verified ? 'Freshness data verified' : 'Freshness data is stale — last verification did not succeed'}
    >
      <Icon size={13} strokeWidth={2.5} />
      {freshness}
    </span>
  )
}
