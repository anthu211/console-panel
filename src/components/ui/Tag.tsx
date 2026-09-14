import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  onRemove?: () => void
  muted?: boolean
  className?: string
}

/** ds-tag — free-form label chip. Read-only unless onRemove is provided. */
export function Tag({ children, onRemove, muted, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-[12px] font-medium',
        muted
          ? 'border-shell-border bg-transparent text-shell-muted'
          : 'border-shell-border bg-shell-raised text-shell-text-2',
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="opacity-60 transition-opacity hover:opacity-100"
          aria-label="Remove"
        >
          <X size={11} />
        </button>
      )}
    </span>
  )
}
