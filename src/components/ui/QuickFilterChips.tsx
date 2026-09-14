import { cn } from '@/lib/utils'

interface QuickFilterChipsProps<T extends string> {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
}

/** Single-select chip row, styled from the ds-pill/filter-btn family. Not a defined DS component. */
export function QuickFilterChips<T extends string>({ options, value, onChange }: QuickFilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Status filter">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-7 rounded-pill px-3 text-[12px] font-medium transition-colors',
              active ? 'bg-accent text-white' : 'bg-shell-raised text-shell-text-2 hover:bg-shell-elevated',
            )}
          >
            {opt.label}
            {opt.count !== undefined && <span className="ml-1.5 opacity-70">{opt.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
