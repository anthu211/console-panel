import type { ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface Crumb {
  label: string
  to?: string
}

interface SubHeaderProps {
  title: string
  breadcrumb: Crumb[]
  right?: ReactNode
}

/** ds sub-header — sticky, two lines (title, then breadcrumb), actions right-aligned. */
export function SubHeader({ title, breadcrumb, right }: SubHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-shell-border bg-shell-bg/95 px-6 py-3 backdrop-blur">
      <div>
        <div className="text-[12px] font-medium text-shell-text">{title}</div>
        <div className="mt-1">
          <Breadcrumb items={breadcrumb} />
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
