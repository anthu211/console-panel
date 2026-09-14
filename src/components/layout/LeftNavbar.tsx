import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface NavChildItem {
  id: string
  label: string
}

export interface NavParentItem {
  id: string
  label: string
  icon: ReactNode
  children?: NavChildItem[]
}

export interface NavSection {
  label: string
  items: NavParentItem[]
}

interface ChevronProps {
  size?: number
  open: boolean
}

const Chevron = ({ size = 12, open }: ChevronProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms cubic-bezier(.2,.8,.2,1)' }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

function SectionLabel({ label, isCollapsed, onClick }: { label: string; isCollapsed: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-expanded={!isCollapsed} className="leftnav__section-label">
      <span className="leftnav__section-label-text">{label}</span>
      <span className={`leftnav__section-chevron${isCollapsed ? ' leftnav__section-chevron--visible' : ''}`}>
        <Chevron size={10} open={!isCollapsed} />
      </span>
    </button>
  )
}

function NavItem({
  item,
  isActiveParent,
  activeChild,
  isOpen,
  onToggle,
  onNav,
}: {
  item: NavParentItem
  isActiveParent: boolean
  activeChild?: string
  isOpen: boolean
  onToggle: () => void
  onNav: (id: string) => void
}) {
  const hasChildren = !!item.children && item.children.length > 0
  const isExpanded = hasChildren && isOpen
  const isSelected = !hasChildren && isActiveParent

  return (
    <div className="nav-item">
      <button
        onClick={() => (hasChildren ? onToggle() : onNav(item.id))}
        className={`nav-item__btn${isExpanded ? ' nav-item__btn--active' : ''}${isSelected ? ' nav-item__btn--selected' : ''}`}
      >
        <span className={`nav-item__icon${isSelected ? ' nav-item__icon--selected' : ''}`}>{item.icon}</span>
        <span className="nav-item__label">{item.label}</span>
        {hasChildren && (
          <span className="nav-item__chevron">
            <Chevron open={isOpen} />
          </span>
        )}
      </button>

      {hasChildren && (
        <div className="nav-item__children" style={{ maxHeight: isOpen ? item.children!.length * 32 : 0 }}>
          {item.children!.map((c) => (
            <button
              key={c.id}
              onClick={() => onNav(c.id)}
              className={`nav-item__child${activeChild === c.id ? ' nav-item__child--active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Rail-collapsed row — hover/focus opens a flyout panel with the item's children.
function RailFlyoutRow({
  item,
  isOpen,
  isActive,
  activeId,
  onOpen,
  onClose,
  onNav,
}: {
  item: NavParentItem
  isOpen: boolean
  isActive: boolean
  activeId?: string
  onOpen: () => void
  onClose: () => void
  onNav: (id: string) => void
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [top, setTop] = useState(0)
  const handleOpen = () => {
    if (btnRef.current) setTop(btnRef.current.getBoundingClientRect().top)
    onOpen()
  }
  const hasChildren = !!item.children && item.children.length > 0

  return (
    <div className="nav-item">
      <button
        ref={btnRef}
        onClick={() => onNav(item.id)}
        onMouseEnter={hasChildren ? handleOpen : undefined}
        onMouseLeave={hasChildren ? onClose : undefined}
        onFocus={hasChildren ? handleOpen : undefined}
        onBlur={hasChildren ? onClose : undefined}
        data-tooltip={isOpen ? undefined : item.label}
        aria-label={item.label}
        className={`nav-item__btn nav-item__btn--rail${isActive ? ' nav-item__btn--selected' : ''}`}
      >
        <span className={`nav-item__icon${isActive ? ' nav-item__icon--selected' : ''}`}>{item.icon}</span>
      </button>
      {hasChildren && isOpen && (
        <div className="leftnav__rail-flyout" style={{ top }} onMouseEnter={handleOpen} onMouseLeave={onClose}>
          <div className="leftnav__rail-flyout-title">{item.label}</div>
          {item.children!.map((c) => (
            <button
              key={c.id}
              className={`leftnav__rail-flyout-row${activeId === c.id ? ' leftnav__rail-flyout-row--active' : ''}`}
              onClick={() => onNav(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export interface LeftNavbarProps {
  sections: NavSection[]
  current?: string
  onNav: (id: string) => void
  collapsed: boolean
}

export default function LeftNavbar({ sections, current, onNav, collapsed }: LeftNavbarProps) {
  const activeParent = current?.split('/')[0]

  const [railFlyoutOpen, setRailFlyoutOpen] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openFlyout = (id: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setRailFlyoutOpen(id)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setRailFlyoutOpen(null), 150)
  }
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])
  useEffect(() => {
    if (!collapsed) setRailFlyoutOpen(null)
  }, [collapsed])

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set())
  const toggleSection = (key: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const [openItems, setOpenItems] = useState<Map<string, boolean>>(() => new Map())
  const isItemOpen = (id: string) => (openItems.has(id) ? openItems.get(id)! : activeParent === id)
  const toggleItem = (id: string) =>
    setOpenItems((prev) => {
      const next = new Map(prev)
      next.set(id, !isItemOpen(id))
      return next
    })

  const navigate = (id: string) => {
    setRailFlyoutOpen(null)
    onNav(id)
  }

  return (
    <aside className={`leftnav${collapsed ? ' leftnav--rail' : ''}`}>
      <div className="leftnav__body">
        {sections.map((section, si) => (
          <div key={section.label}>
            {si > 0 && <div className="leftnav__divider" />}
            {!collapsed && (
              <SectionLabel
                label={section.label}
                isCollapsed={collapsedSections.has(section.label)}
                onClick={() => toggleSection(section.label)}
              />
            )}
            {(collapsed || !collapsedSections.has(section.label)) &&
              section.items.map((item) =>
                collapsed ? (
                  <RailFlyoutRow
                    key={item.id}
                    item={item}
                    isOpen={railFlyoutOpen === item.id}
                    isActive={activeParent === item.id}
                    activeId={current}
                    onOpen={() => openFlyout(item.id)}
                    onClose={scheduleClose}
                    onNav={navigate}
                  />
                ) : (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActiveParent={activeParent === item.id}
                    activeChild={current}
                    isOpen={isItemOpen(item.id)}
                    onToggle={() => toggleItem(item.id)}
                    onNav={navigate}
                  />
                ),
              )}
          </div>
        ))}
      </div>
    </aside>
  )
}
