import {
  Activity,
  ArrowDown,
  ArrowUp,
  Building2,
  CalendarDays,
  ClipboardList,
  Compass,
  Container,
  Hash,
  History,
  Layers,
  Puzzle,
  Rocket,
  RotateCw,
  ScrollText,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { SubNavbar } from '@/components/layout/SubNavbar'
import { Button } from '@/components/ui/Button'
import { KeyValueList, KeyValueRow } from '@/components/ui/KeyValue'
import { SectionNav, type SectionNavItem } from '@/components/ui/SectionNav'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tag } from '@/components/ui/Tag'
import { Pill } from '@/components/ui/Badge'
import { BuildTypeBadge } from '@/components/environments/BuildTypeBadge'
import { DeploymentModelPill } from '@/components/environments/DeploymentModelPill'
import { FreshnessBadge } from '@/components/environments/FreshnessBadge'
import { ManagedElsewhereChip } from '@/components/environments/ManagedElsewhereChip'
import { StatusBadge } from '@/components/environments/StatusBadge'
import { CloudProviderCell } from '@/components/environments/CloudProviderIcon'
import { mockEnvironments, type DeploymentRunStatus, type DriftStatus } from '@/data/environments'
import { formatDate, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

const SECTIONS: SectionNavItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'topology', label: 'Topology' },
  { id: 'version', label: 'Software Version' },
  { id: 'configuration', label: 'Configuration Snapshot' },
  { id: 'resources', label: 'Resource Details' },
  { id: 'usage-cost', label: 'Usage & Cost', dividerBefore: true },
  { id: 'deployment-history', label: 'Deployment history' },
  { id: 'access', label: 'Access' },
  { id: 'audit-log', label: 'Audit log' },
]

const driftVariant: Record<DriftStatus, 'green' | 'red' | 'yellow'> = {
  'In sync': 'green',
  Drifted: 'red',
  Unknown: 'yellow',
}

const deploymentStatusVariant: Record<DeploymentRunStatus, 'green' | 'red' | 'yellow'> = {
  Success: 'green',
  Failed: 'red',
  'Rolled back': 'yellow',
}

// Free-form platform component names (customer-configurable) — Puzzle is the fallback for
// any name outside this known set of product modules.
const platformComponentIcon: Record<string, LucideIcon> = {
  'Exposure Management': ShieldAlert,
  'Risk Register': ClipboardList,
  Navigator: Compass,
  'Asset Deep Dive': Search,
  Compliance: ShieldCheck,
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-card border border-card-border bg-card-bg p-6">
      <h2 className="mb-1 text-[14px] font-semibold text-shell-text">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function EnvironmentDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const env = mockEnvironments.find((e) => e.id === id)
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fromSearch = (location.state as { fromSearch?: string } | null)?.fromSearch
  const backTo = fromSearch ? `/environments?${fromSearch}` : '/environments'

  // Re-arms on every id change so navigating between environments (no route remount)
  // still shows a loading state instead of instantly resolving to stale content.
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [id])

  function fireAction(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2500)
  }

  if (loading) {
    return <DetailsSkeleton backTo={backTo} />
  }

  if (!env) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-16 text-center">
        <div className="mb-2 text-[14px] font-semibold text-shell-text">Environment not found</div>
        <p className="text-[12px] text-shell-muted">It may have been purged or the link is out of date.</p>
      </div>
    )
  }

  const resources = env.resourceDetails

  return (
    <div>
      <SubNavbar
        title={`${env.customerName} / ${env.environmentId}`}
        breadcrumb={[
          { label: 'Control Plane' },
          { label: 'Environments', to: backTo },
          { label: env.environmentId },
        ]}
        actions={
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => document.getElementById('audit-log')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <ScrollText size={13} />
              View Audit Log
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => fireAction(`Update check queued for ${env.environmentId}.`)}
            >
              <RotateCw size={13} />
              Trigger Update
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-7"
              onClick={() => fireAction(`Deployment started for ${env.environmentId}.`)}
            >
              <Rocket size={13} />
              Deploy
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="space-y-6">
          {/* At-a-glance strip — the facts you'd otherwise open every card to find. */}
          <div className="rounded-card border border-card-border bg-card-bg p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[14px] font-semibold text-shell-text">{env.environmentId}</span>
                <StatusBadge status={env.status} />
                <FreshnessBadge freshness={env.freshness} />
              </div>
              <BuildTypeBadge buildType={env.softwareVersionDetails.buildType} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
              <DeploymentModelPill model={env.deploymentModel} />
              <CloudProviderCell provider={env.cloudProvider} region={env.region} />
              <span className="text-shell-muted">Created {formatDate(env.createdDate)}</span>
              <span className="text-shell-muted">
                Lead:{' '}
                {env.assignedDeliveryLead ?? <span className="italic">Unassigned</span>}
              </span>
            </div>

            <div className="mt-4 grid grid-flow-col auto-cols-fr gap-2 border-t border-shell-border pt-4">
              <StatTile label="Software version" value={env.softwareVersion} mono />
              {resources.applicable && resources.vmCount !== undefined && (
                <StatTile label="VMs" value={resources.vmCount} />
              )}
              {resources.applicable && resources.storageVolumeCount !== undefined && (
                <StatTile label="Storage volumes" value={resources.storageVolumeCount} />
              )}
              {resources.otherResources?.map((r) => (
                <StatTile key={r.label} label={r.label} value={r.count} />
              ))}
              {!resources.applicable && (
                <div className="flex items-center rounded-card border border-dashed border-shell-border px-3 py-3 text-[12px] italic text-shell-muted">
                  Resource details are not tracked for this environment.
                </div>
              )}
            </div>
          </div>

          <SectionNav items={SECTIONS} />

          <Section id="summary" title="Summary">
            <KeyValueList>
              <KeyValueRow label="Customer" icon={Building2}>
                {env.customerName}
              </KeyValueRow>
              <KeyValueRow label="Environment identifier" icon={Hash} mono>
                {env.environmentId}
              </KeyValueRow>
              <KeyValueRow label="Created" icon={CalendarDays}>
                {formatDate(env.createdDate)}
              </KeyValueRow>
              <KeyValueRow label="Deployment model" icon={Layers}>
                <DeploymentModelPill model={env.deploymentModel} />
              </KeyValueRow>
              <KeyValueRow label="Status" icon={Activity}>
                <StatusBadge status={env.status} />
              </KeyValueRow>
              <KeyValueRow label="Assigned delivery lead" icon={UserRound}>
                {env.assignedDeliveryLead ?? <span className="italic text-shell-muted">Unassigned</span>}
              </KeyValueRow>
            </KeyValueList>
          </Section>

          <Section id="topology" title="Topology">
            <KeyValueList>
              <KeyValueRow label="Kubernetes cluster" icon={Container}>
                <ManagedElsewhereChip value={env.topology.kubernetesClusterId} />
              </KeyValueRow>
              <KeyValueRow label="Cloud account reference" icon={Hash} mono>
                {env.topology.cloudAccountRef}
              </KeyValueRow>
            </KeyValueList>
            <div className="mt-4 border-t border-shell-border pt-4">
              <div className="mb-2 text-[12px] text-shell-muted">Platform components deployed</div>
              <div className="flex flex-wrap gap-1.5">
                {env.topology.platformComponents.map((c) => {
                  const ComponentIcon = platformComponentIcon[c] ?? Puzzle
                  return (
                    <Tag key={c}>
                      <ComponentIcon size={12} className="opacity-70" />
                      {c}
                    </Tag>
                  )
                })}
              </div>
            </div>
          </Section>

          <Section id="version" title="Software Version">
            <KeyValueList>
              <KeyValueRow label="Last version change" icon={History}>
                {env.softwareVersionDetails.lastVersionChangeDate ? (
                  formatDate(env.softwareVersionDetails.lastVersionChangeDate)
                ) : (
                  <span className="italic text-shell-muted">Not yet available</span>
                )}
              </KeyValueRow>
            </KeyValueList>
          </Section>

          <Section id="configuration" title="Configuration Snapshot">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[12px] text-shell-muted">Drift status</span>
              <Pill variant={driftVariant[env.configSnapshot.driftStatus]}>{env.configSnapshot.driftStatus}</Pill>
            </div>
            <KeyValueList>
              {Object.entries(env.configSnapshot.configValues).map(([key, value]) => (
                <KeyValueRow key={key} label={key} icon={SlidersHorizontal}>
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </KeyValueRow>
              ))}
            </KeyValueList>
            <div className="mt-4">
              <div className="mb-2 text-[12px] text-shell-muted">Feature flags</div>
              {env.configSnapshot.featureFlags.length === 0 ? (
                <p className="text-[12px] text-shell-muted">No feature flags configured.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {env.configSnapshot.featureFlags.map((flag) => (
                    <span
                      key={flag.name}
                      className="inline-flex items-center gap-1.5 rounded-pill border border-shell-border bg-shell-raised px-2 py-1 text-[12px]"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${flag.enabled ? 'bg-[#31A56D]' : 'bg-shell-muted'}`}
                      />
                      {flag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section id="resources" title="Resource Details">
            {!resources.applicable ? (
              <p className="text-[12px] italic text-shell-muted">
                Resource details are not applicable for this environment.
              </p>
            ) : (
              <div className="grid grid-flow-col auto-cols-fr gap-3">
                {resources.vmCount !== undefined && <StatTile label="VMs" value={resources.vmCount} />}
                {resources.storageVolumeCount !== undefined && (
                  <StatTile label="Storage volumes" value={resources.storageVolumeCount} />
                )}
                {resources.otherResources?.map((r) => (
                  <StatTile key={r.label} label={r.label} value={r.count} />
                ))}
              </div>
            )}
          </Section>

          <Section id="usage-cost" title="Usage & Cost">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile
                label="Monthly cost"
                value={
                  <span className="inline-flex items-baseline gap-2">
                    ${env.usageCost.monthlyCostUsd.toLocaleString()}
                    <CostTrend pct={env.usageCost.costTrendPct} />
                  </span>
                }
              />
              <StatTile label="API calls (30d)" value={env.usageCost.apiCallsLast30d.toLocaleString()} />
              <StatTile label="Storage used" value={`${env.usageCost.storageUsedGb.toLocaleString()} GB`} />
            </div>
          </Section>

          <Section id="deployment-history" title="Deployment History">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-shell-muted">
                    <th className="pb-2 pr-4">Version</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Deployed by</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {env.deploymentHistory.map((d, i) => (
                    <tr key={i} className="border-t border-shell-border">
                      <td className="py-2.5 pr-4 font-mono text-shell-text">{d.version}</td>
                      <td className="py-2.5 pr-4 text-shell-text-2">{formatDate(d.date)}</td>
                      <td className="py-2.5 pr-4 text-shell-text-2">{d.deployedBy}</td>
                      <td className="py-2.5">
                        <Pill variant={deploymentStatusVariant[d.status]}>{d.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="access" title="Access">
            {env.access.length === 0 ? (
              <p className="text-[12px] italic text-shell-muted">No access records for this environment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-shell-muted">
                      <th className="pb-2 pr-4">Name</th>
                      <th className="pb-2 pr-4">Role</th>
                      <th className="pb-2">Last accessed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {env.access.map((a, i) => (
                      <tr key={i} className="border-t border-shell-border">
                        <td className="py-2.5 pr-4 text-shell-text">{a.name}</td>
                        <td className="py-2.5 pr-4 text-shell-text-2">{a.role}</td>
                        <td className="py-2.5 text-shell-text-2">
                          {a.lastAccessed ? (
                            formatDateTime(a.lastAccessed)
                          ) : (
                            <span className="italic text-shell-muted">Never</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <Section id="audit-log" title="Audit Log">
            <ul className="space-y-3">
              {env.auditLog.map((entry, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px]">
                  <span className="w-40 shrink-0 font-mono text-[11px] text-shell-muted">
                    {formatDateTime(entry.timestamp)}
                  </span>
                  <span className="font-medium text-shell-text">{entry.actor}</span>
                  <span className="text-shell-text-2">{entry.action}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-card border border-[rgba(99,96,216,0.2)] bg-[rgba(99,96,216,0.08)] px-4 py-3 text-[13px] font-medium text-[#6360D8] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
        >
          {toast}
        </div>
      )}
    </div>
  )
}

/** Loading placeholder — kept visually distinct from the "not found" state so a slow
 * fetch never reads as a bad link, and from the loaded page so nothing looks final. */
function DetailsSkeleton({ backTo }: { backTo: string }) {
  return (
    <div>
      <SubNavbar
        title="Loading environment…"
        breadcrumb={[{ label: 'Control Plane' }, { label: 'Environments', to: backTo }]}
      />
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="space-y-6">
          <div className="rounded-card border border-card-border bg-card-bg p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-4 grid grid-flow-col auto-cols-fr gap-2 border-t border-shell-border pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-card border border-card-border bg-card-bg p-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              ))}
            </div>
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-card border border-card-border bg-card-bg p-6">
              <Skeleton className="h-4 w-32" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CostTrend({ pct }: { pct: number }) {
  if (pct === 0) {
    return <span className="text-[11px] font-medium text-shell-muted">flat</span>
  }
  const up = pct > 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-[11px] font-semibold',
        up ? 'text-[#D12329]' : 'text-[#31A56D]',
      )}
    >
      {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
      {Math.abs(pct)}%
    </span>
  )
}

/** ds-kpi-card — value + label only, per DS spec (no icons/colored borders/custom bg on this component). */
function StatTile({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-card border border-card-border bg-card-bg px-3 py-2.5">
      <div className="truncate text-[10.5px] font-semibold uppercase tracking-wide text-shell-muted">{label}</div>
      <div
        className={cn(
          'mt-1.5 text-[19px] font-bold leading-none tabular-nums text-shell-text',
          mono && 'font-mono tracking-tight',
        )}
      >
        {value}
      </div>
    </div>
  )
}
