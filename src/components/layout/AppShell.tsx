import {
  Activity,
  ArrowUpFromLine,
  DollarSign,
  ScrollText,
  Server,
  Settings2,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LeftNavbar from './LeftNavbar'
import type { NavSection } from './LeftNavbar'
import Topbar from './Topbar'
import './LeftNavbar.css'
import './Topbar.css'

const SECTIONS: NavSection[] = [
  {
    label: 'Manage',
    items: [
      { id: 'environments', label: 'Environments', icon: <Server size={15} /> },
      { id: 'deployments', label: 'Deployments & Upgrades', icon: <ArrowUpFromLine size={15} /> },
      { id: 'configurations', label: 'Configurations', icon: <Settings2 size={15} /> },
    ],
  },
  {
    label: 'Visibility',
    items: [
      { id: 'cost-usage', label: 'Cost & Usage', icon: <DollarSign size={15} /> },
      { id: 'health-monitoring', label: 'Health Monitoring', icon: <Activity size={15} /> },
    ],
  },
  {
    label: 'Governance',
    items: [
      { id: 'access-control', label: 'Access Control', icon: <ShieldCheck size={15} /> },
      { id: 'audit-log', label: 'Audit Log', icon: <ScrollText size={15} /> },
    ],
  },
]

// ids without an entry here are not-yet-implemented and no-op on click
const ROUTE_MAP: Record<string, string> = {
  environments: '/environments',
}

const COLLAPSE_KEY = 'cp_nav_collapsed'
const THEME_KEY = 'cp_theme'

/** Standard shell: topbar (#131313) + left nav + content. DS forbids inventing new page layouts. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === 'true')
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light',
  )
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed))
  }, [collapsed])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const current = Object.keys(ROUTE_MAP).find(
    (id) => location.pathname === ROUTE_MAP[id] || location.pathname.startsWith(`${ROUTE_MAP[id]}/`),
  )

  const handleNav = (id: string) => {
    const to = ROUTE_MAP[id]
    if (to) navigate(to) // ids with no route are not-yet-implemented; no-op
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-shell-bg">
      <Topbar
        logo={<img src={`${import.meta.env.BASE_URL}pai-logo.svg`} alt="Prevalent AI" className="h-[26px] w-auto" />}
        onLogoClick={() => navigate('/')}
        navCollapsed={collapsed}
        onToggleNavCollapse={() => setCollapsed((c) => !c)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        accountName="Admin"
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftNavbar
          sections={SECTIONS}
          current={current}
          onNav={handleNav}
          collapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
