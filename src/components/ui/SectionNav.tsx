import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface SectionNavItem {
  id: string
  label: string
  /** Renders a vertical divider before this item, to set it apart as a separate group. */
  dividerBefore?: boolean
}

function getScrollParent(el: HTMLElement | null): HTMLElement | (Window & typeof globalThis) {
  let node = el?.parentElement
  while (node) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll') return node
    node = node.parentElement
  }
  return window
}

/**
 * Sticky anchored section nav with scrollspy highlighting. NOT a tabs component —
 * every section stays mounted and scrollable in one pass; this only tracks scroll
 * position and jumps to anchors. The DS forbids page-level tabs for this reason.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Among sections currently in the top band, the active one is whichever
        // started most recently — i.e. the largest (closest-to-zero) top offset.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))

    // Edge case: a short last section never reaches the observer's top band once
    // the scroll container hits its limit — force it active when we're at the bottom.
    const scrollParent = getScrollParent(elements[0])
    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollParent === window
          ? { scrollTop: window.scrollY, scrollHeight: document.documentElement.scrollHeight, clientHeight: window.innerHeight }
          : (scrollParent as HTMLElement)
      const atBottom = scrollTop + clientHeight >= scrollHeight - 8
      if (atBottom) setActiveId(items[items.length - 1].id)
    }
    scrollParent.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      scrollParent.removeEventListener('scroll', handleScroll)
    }
  }, [items])

  return (
    <nav aria-label="Section navigation" className="sticky top-12 z-30 flex flex-wrap gap-1.5 border-b border-shell-border bg-card-bg py-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1.5">
          {item.dividerBefore && <span className="h-4 w-px bg-shell-border" aria-hidden="true" />}
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setActiveId(item.id)
            }}
            className={cn(
              'rounded-pill px-3 py-1.5 text-[12px] font-medium no-underline transition-colors',
              activeId === item.id
                ? 'bg-shell-active text-accent'
                : 'text-shell-muted hover:bg-shell-hover hover:text-shell-text',
            )}
          >
            {item.label}
          </a>
        </div>
      ))}
    </nav>
  )
}
