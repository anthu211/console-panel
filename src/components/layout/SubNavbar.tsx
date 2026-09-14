import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Crumb {
  label: string
  to?: string
}

interface SubNavbarProps {
  title: string
  breadcrumb?: Crumb[]
  /** Extra content (badges, status pills, etc.) shown inline next to the title/breadcrumb. */
  meta?: ReactNode
  onFilter?: () => void
  filterActive?: boolean
  /** Page-specific action buttons on the right, in place of the Filter toggle. */
  actions?: ReactNode
}

/** ds sub-navbar — title/breadcrumb (+ optional badges), filter toggle (or page actions). */
export function SubNavbar({
  title,
  breadcrumb = [],
  meta,
  onFilter,
  filterActive,
  actions,
}: SubNavbarProps) {
  return (
    <div className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-shell-border bg-card-bg px-6">
      <div className="flex min-w-0 flex-col">
        <div className="truncate text-[12px] font-semibold leading-tight text-shell-text">{title}</div>
        {breadcrumb.length > 0 && (
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-shell-muted">
            {breadcrumb.map((crumb, i) => {
              const isLast = i === breadcrumb.length - 1
              return (
                <span key={crumb.label} className="flex items-center gap-1">
                  {i > 0 && <span>›</span>}
                  {isLast || !crumb.to ? (
                    <span className={isLast ? 'font-medium text-accent' : undefined}>{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="text-shell-muted no-underline hover:text-shell-text hover:underline">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {meta && <div className="flex shrink-0 items-center gap-2">{meta}</div>}

      <div className="flex-1" />

      <div className="h-5 w-px shrink-0 bg-shell-border" />

      {actions ?? (
        <button
          type="button"
          onClick={onFilter}
          aria-pressed={!!filterActive}
          className={cn(
            'inline-flex h-7 shrink-0 items-center gap-2 rounded-pill border border-transparent bg-[#e0dff7] px-3 text-[12px] font-medium text-[#504bb8]',
            filterActive && 'border-accent bg-[#f0f0fc] text-accent',
          )}
        >
          Filter
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
