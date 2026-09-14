import { Search, X } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange, className, placeholder, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-shell-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-pill border border-ctrl-border bg-ctrl-bg pl-9 pr-8 text-[12px] text-shell-text',
          'placeholder:text-ctrl-placeholder',
          'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-shell-muted hover:text-shell-text"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
