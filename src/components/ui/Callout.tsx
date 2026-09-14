import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CalloutVariant = 'error' | 'success' | 'warning' | 'info'

const variantClasses: Record<CalloutVariant, string> = {
  error: 'bg-[#F9EEEE] text-[#D12329] border-[rgba(209,35,41,0.2)] dark:bg-[rgba(209,35,41,0.28)] dark:text-shell-text dark:border-[rgba(209,35,41,0.35)]',
  success: 'bg-[#EFF7ED] text-[#1A7D4D] border-[rgba(49,165,109,0.2)] dark:bg-[rgba(49,165,109,0.28)] dark:text-shell-text dark:border-[rgba(49,165,109,0.35)]',
  warning: 'bg-[#F7F6EB] text-[#D98B1D] border-[rgba(217,139,29,0.2)] dark:bg-[rgba(217,139,29,0.28)] dark:text-shell-text dark:border-[rgba(217,139,29,0.35)]',
  info: 'bg-[rgba(99,96,216,0.08)] text-[#8F8DDE] border-[rgba(99,96,216,0.2)]',
}

const variantIcons: Record<CalloutVariant, typeof Info> = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
}

interface CalloutProps {
  variant: CalloutVariant
  children: ReactNode
  action?: ReactNode
  className?: string
}

/** ds-callout — banner/inline alert. Used here for the "freshness collection failing" banner. */
export function Callout({ variant, children, action, className }: CalloutProps) {
  const Icon = variantIcons[variant]
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-card border px-4 py-3 text-[14px] leading-relaxed',
        variantClasses[variant],
        className,
      )}
      role="status"
    >
      <Icon size={16} className="shrink-0" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}
