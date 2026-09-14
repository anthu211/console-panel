import { ListFilter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActiveFiltersPillProps {
  count: number
  onClearAll: () => void
}

/** ds-filter sub-header pill — count of applied facet/search filters, clears all in one action. */
export function ActiveFiltersPill({ count, onClearAll }: ActiveFiltersPillProps) {
  if (count === 0) {
    return (
      <span className="flex items-center gap-1.5 rounded-pill bg-shell-raised px-3 py-1 text-[12px] font-medium text-shell-muted">
        <ListFilter size={12} />
        No active filters
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onClearAll}
      className={cn(
        'flex items-center gap-1.5 rounded-pill bg-[#e0dff7] px-3 py-1 text-[12px] font-semibold text-[#504bb8]',
        'hover:bg-[#d4d2f2]',
      )}
      title="Clear all applied filters"
    >
      <ListFilter size={12} />
      {count} active filter{count === 1 ? '' : 's'}
    </button>
  )
}
