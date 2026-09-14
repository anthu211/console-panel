import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  className?: string
}

/**
 * ds-dropdown — trigger is `ds-btn sz-md t-outline` per the DS's Dropdown/Select
 * pattern, so it's built on the same Button component rather than restyled by hand.
 */
export function Dropdown<T extends string>({ value, options, onChange, className }: DropdownProps<T>) {
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as T)}>
      <Select.Trigger asChild>
        <Button
          variant="outline"
          size="md"
          className={cn(
            'gap-1.5 [&_svg]:transition-transform [&[data-state=open]_svg]:rotate-180',
            className,
          )}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={13} className="text-shell-muted" />
          </Select.Icon>
        </Button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-[220px] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-card-border bg-card-bg shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[12px] text-shell-text-2 outline-none data-[highlighted]:bg-shell-hover data-[state=checked]:font-medium data-[state=checked]:text-shell-text"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={13} className="text-accent" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
