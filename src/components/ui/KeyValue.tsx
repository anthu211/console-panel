import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface KeyValueRowProps {
  label: string
  children: ReactNode
  mono?: boolean
  icon?: LucideIcon
}

/**
 * KeyValue / description-list row. Not a defined DS component — composed from
 * typography tokens (body-sm label, body-md value) to match card/table conventions.
 * Nullable values render an explicit placeholder rather than hiding the row.
 */
export function KeyValueRow({ label, children, mono, icon: Icon }: KeyValueRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-1.5 text-[12px] text-shell-muted">
        {Icon && <Icon size={13} className="shrink-0 text-shell-muted" />}
        {label}
      </dt>
      <dd className={cn('text-right text-[14px] text-shell-text', mono && 'font-mono text-[12px]')}>{children}</dd>
    </div>
  )
}

export function KeyValueList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-shell-border">{children}</dl>
}
