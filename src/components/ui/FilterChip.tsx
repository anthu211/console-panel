import { X } from 'lucide-react'

interface FilterChipProps {
  chipKey: string
  value: string
  onRemove: () => void
}

/** ds-filter-chip-active — key:value pair shown in the active-filters bar. */
export function FilterChip({ chipKey, value, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-shell-raised px-2 py-1 text-[12px]">
      <span className="font-medium text-shell-muted">{chipKey}</span>
      <span className="text-accent">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full text-shell-muted hover:text-shell-text"
        aria-label={`Remove ${chipKey}: ${value} filter`}
      >
        <X size={11} />
      </button>
    </span>
  )
}
