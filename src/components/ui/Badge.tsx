import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'danger' | 'high' | 'caution' | 'warning' | 'info' | 'success' | 'neutral' | 'full'

const variantClasses: Record<BadgeVariant, string> = {
  danger: 'bg-[#F9EEEE] text-[#D12329] dark:bg-[#260808]',
  high: 'bg-[#FFF0F0] text-[#E15252] dark:bg-[#260808]',
  caution: 'bg-[#FFF3E0] text-[#E57B1D] dark:bg-[#514B09]',
  warning: 'bg-[#FEF3C7] text-[#D98B1D] dark:bg-[#514B09]',
  info: 'bg-[rgba(99,96,216,0.14)] text-[#8F8DDE]',
  success: 'bg-[#EFF7ED] text-[#31A56D] dark:bg-[#192C15]',
  neutral: 'bg-shell-raised text-shell-muted',
  full: 'bg-[#EAF5EF] text-[#1A7D4D] dark:bg-[#192C15]',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant
  dot?: boolean
}

/** ds-badge — severity/status indicator. Never used tooltip-only. */
export function Badge({ variant, dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-card px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}

type PillVariant = 'green' | 'yellow' | 'red' | 'orange' | 'purple' | 'blue' | 'teal'

const pillClasses: Record<PillVariant, string> = {
  green: 'text-[#31A56D] bg-[#EFF7ED] border-[#31A56D] dark:bg-[#192C15]',
  yellow: 'text-[#D98B1D] bg-[#F2EDDB] border-[#D98B1D] dark:bg-[#2C2613]',
  red: 'text-[#D12329] bg-[#F9EEEE] border-[#D12329] dark:bg-[#260808]',
  orange: 'text-[#E57B1D] bg-[#F7F6EB] border-[#E57B1D] dark:bg-[#514B09]',
  // Non-severity categorical tones — a muted cool spectrum pulled from the DS's
  // accent/special tokens, for attributes (e.g. deployment model) that are a
  // category rather than a red/amber/green status signal. Kept low-saturation
  // (soft border, dimmer text) so they read as neutral labels, not alerts.
  purple: 'text-accent bg-shell-active border-[rgba(99,96,216,0.35)]',
  blue: 'text-[#4C6FA3] bg-[rgba(70,127,205,0.08)] border-[rgba(70,127,205,0.35)]',
  teal: 'text-[#3F8996] bg-[rgba(71,173,203,0.08)] border-[rgba(71,173,203,0.35)]',
}

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant: PillVariant
}

/** ds-pill — border-styled status tag, lighter weight than a filled badge. */
export function Pill({ variant, className, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-[12px] font-semibold',
        pillClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
