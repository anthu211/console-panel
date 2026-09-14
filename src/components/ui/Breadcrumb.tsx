import { Fragment } from 'react'
import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

/** ds-breadcrumb — ancestor links muted, current page in accent, never a link. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-[12px]" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Fragment key={item.label}>
            {i > 0 && <span className="text-shell-muted">/</span>}
            {isLast || !item.to ? (
              <span className={isLast ? 'font-medium text-accent' : 'text-shell-muted'}>{item.label}</span>
            ) : (
              <Link to={item.to} className="text-shell-muted no-underline hover:text-shell-text hover:underline">
                {item.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
