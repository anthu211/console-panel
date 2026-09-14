import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectFilterProps {
  label: string
  options: MultiSelectOption[]
  selected: string[]
  onApply: (values: string[]) => void
}

/** ds-ms — multi-select facet dropdown. Search + checkbox list + select-all + Apply/Cancel footer. */
export function MultiSelectFilter({ label, options, selected, onApply }: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(selected)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (open) {
      setDraft(selected)
      setSearch('')
    }
  }, [open, selected])

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
  const allSelected = filtered.length > 0 && filtered.every((o) => draft.includes(o.value))
  const someSelected = filtered.some((o) => draft.includes(o.value))

  function toggle(value: string) {
    setDraft((d) => (d.includes(value) ? d.filter((v) => v !== value) : [...d, value]))
  }

  function toggleAll() {
    if (allSelected) {
      setDraft((d) => d.filter((v) => !filtered.some((o) => o.value === v)))
    } else {
      setDraft((d) => Array.from(new Set([...d, ...filtered.map((o) => o.value)])))
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 items-center gap-2 rounded-pill border border-shell-border bg-transparent px-3 text-[14px] text-shell-text-2',
            'hover:border-shell-muted hover:bg-shell-hover',
          )}
        >
          {label}
          {selected.length > 0 && (
            <span className="rounded-pill bg-accent px-1.5 py-0.5 text-[12px] font-semibold leading-none text-white">
              {selected.length}
            </span>
          )}
          <ChevronDown size={13} className="text-shell-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 flex w-[var(--radix-popover-trigger-width)] max-h-[340px] flex-col rounded-lg border border-card-border bg-card-bg shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        >
          {options.length > 8 && (
            <div className="border-b border-shell-border p-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="h-8 w-full rounded-md border border-ctrl-border bg-ctrl-bg px-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-1">
            <label
              onClick={toggleAll}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium hover:bg-shell-hover"
            >
              <Checkbox checked={allSelected} indeterminate={!allSelected && someSelected} />
              Select all
            </label>
            {filtered.map((option) => (
              <label
                key={option.value}
                onClick={() => toggle(option.value)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12px] text-shell-text-2 hover:bg-shell-hover"
              >
                <Checkbox checked={draft.includes(option.value)} />
                {option.label}
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="px-2 py-4 text-center text-[12px] text-shell-muted">No matches</div>
            )}
          </div>
          <div className="flex justify-end gap-2 border-t border-shell-border p-2">
            <button
              type="button"
              onClick={() => {
                onApply(draft)
                setOpen(false)
              }}
              className="h-7 rounded-pill bg-accent px-3 text-[12px] font-medium text-white hover:bg-accent-dark"
            >
              Apply
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

/** Presentational only — the enclosing <label>'s onClick drives the toggle so the whole row is clickable. */
function Checkbox({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <span
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
        checked || indeterminate ? 'border-accent bg-accent text-white' : 'border-ctrl-border bg-ctrl-bg',
      )}
    >
      {checked && <Check size={11} strokeWidth={3} />}
      {!checked && indeterminate && <Minus size={11} strokeWidth={3} />}
    </span>
  )
}
