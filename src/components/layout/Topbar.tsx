import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const PanelToggleIcon = ({ open, size = 15 }: { open: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
    <path d={open ? 'M13.5 9l2.5 3-2.5 3' : 'M16 9l-2.5 3 2.5 3'} />
  </svg>
)
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export interface TopbarNotification {
  id: string | number
  text: string
  read?: boolean
}

export interface TopbarMenuItem {
  id: string
  label: string
  icon: ReactNode
  danger?: boolean
  dividerBefore?: boolean
}

export interface TopbarProps {
  logo: ReactNode
  onLogoClick?: () => void
  navCollapsed?: boolean
  onToggleNavCollapse?: () => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
  notifications?: TopbarNotification[]
  onNotifClick?: () => void
  accountName?: string
  accountSubtitle?: string
  menuItems?: TopbarMenuItem[]
  onMenuSelect?: (id: string) => void
}

export default function Topbar({
  logo,
  onLogoClick,
  navCollapsed,
  onToggleNavCollapse,
  theme = 'light',
  onToggleTheme,
  notifications = [],
  onNotifClick,
  accountName,
  accountSubtitle,
  menuItems = [],
  onMenuSelect,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  useEffect(() => {
    if (!notifOpen) return
    const onDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [notifOpen])

  return (
    <header className="topbar">
      {onToggleNavCollapse && (
        <button
          className="topbar__btn topbar__nav-toggle"
          onClick={onToggleNavCollapse}
          title={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelToggleIcon open={!!navCollapsed} />
        </button>
      )}

      <button className="topbar__logo-btn" onClick={onLogoClick} aria-label="Home">
        {logo}
      </button>

      <div className="topbar__spacer" />

      {onToggleTheme && (
        <button
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="topbar__btn"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      )}

      <div ref={notifRef} className="topbar__notif">
        <button
          title="Notifications"
          aria-label="Notifications"
          aria-haspopup="menu"
          aria-expanded={notifOpen}
          className="topbar__btn"
          onClick={() => {
            setNotifOpen((o) => !o)
            onNotifClick?.()
          }}
        >
          <BellIcon />
          {unreadCount > 0 && <span className="topbar__notif-dot" />}
        </button>

        {notifOpen && (
          <div className="topbar__notif-panel" role="menu">
            <div className="topbar__notif-panel-title">Notifications</div>
            {notifications.length === 0 ? (
              <div className="topbar__notif-empty">You're all caught up</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`topbar__notif-item${n.read ? '' : ' topbar__notif-item--unread'}`}>
                  {n.text}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div ref={menuRef} className="topbar__account">
        <button
          title="Account menu"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="topbar__avatar"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <UserIcon />
        </button>

        {menuOpen && (
          <div className="topbar__account-menu" role="menu">
            {(accountName || accountSubtitle) && (
              <>
                <div className="topbar__account-menu-header">
                  {accountName && <div className="topbar__account-menu-name">{accountName}</div>}
                  {accountSubtitle && <div className="topbar__account-menu-subtitle">{accountSubtitle}</div>}
                </div>
                <div className="topbar__account-menu-divider" />
              </>
            )}
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.dividerBefore && <div className="topbar__account-menu-divider" />}
                <button
                  className={`topbar__account-menu-item${item.danger ? ' topbar__account-menu-item--danger' : ''}`}
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    onMenuSelect?.(item.id)
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
