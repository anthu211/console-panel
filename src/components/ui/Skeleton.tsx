import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

/** ds-skeleton — shimmer placeholder. Prefer over spinner whenever layout shape is known. */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-card bg-[length:200%_100%]',
        'bg-[linear-gradient(90deg,var(--shell-raised)_25%,var(--shell-elevated)_50%,var(--shell-raised)_75%)]',
        className,
      )}
      style={style}
    />
  )
}
