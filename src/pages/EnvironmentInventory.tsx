import {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronUp,
  Download,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { TableEmptyState } from "@/components/ui/EmptyState";
import { SubNavbar } from "@/components/layout/SubNavbar";
import { CloudProviderCell } from "@/components/environments/CloudProviderIcon";
import { DeploymentModelPill } from "@/components/environments/DeploymentModelPill";
import { FreshnessBadge } from "@/components/environments/FreshnessBadge";
import { StatusBadge } from "@/components/environments/StatusBadge";
import {
  mockEnvironmentSummaries,
  type EnvironmentStatus,
} from "@/data/environments";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const COLUMN_COUNT = 9; // freshness, customer/env, status, model, cloud, version, created, last sync, chevron
const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: EnvironmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Provisioning", label: "Provisioning" },
  { value: "Suspended", label: "Suspended" },
  { value: "Purged", label: "Purged" },
];

const MODEL_OPTIONS = [
  { value: "Prevalent Hosted", label: "Prevalent Hosted" },
  { value: "Hybrid Hosted", label: "Hybrid Hosted" },
  { value: "Client Hosted", label: "Client Hosted" },
];

const PROVIDER_OPTIONS = [
  { value: "AWS", label: "AWS" },
  { value: "Azure", label: "Azure" },
];

const FRESHNESS_OPTIONS = [
  { value: "Verified", label: "Verified" },
  { value: "Stale", label: "Stale" },
];

function csv(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  return raw ? raw.split(",").filter(Boolean) : [];
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function EnvironmentInventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const query = searchParams.get("q") ?? "";
  const status =
    (searchParams.get("status") as EnvironmentStatus | null) ?? "all";
  const models = csv(searchParams, "models");
  const providers = csv(searchParams, "providers");
  const freshness = csv(searchParams, "freshness");

  const activeFilterCount =
    (status !== "all" ? 1 : 0) +
    (models.length > 0 ? 1 : 0) +
    (providers.length > 0 ? 1 : 0) +
    (freshness.length > 0 ? 1 : 0) +
    (query.trim() ? 1 : 0);

  function clearAllFilters() {
    updateParams({ status: null, models: null, providers: null, freshness: null, q: null });
  }

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    setSearchParams(params, { replace: true });
    setPage(1);
  }

  const allEnvironments = mockEnvironmentSummaries;

  // System-health banner: reflects overall data collection, not the current filter view.
  const staleCount = allEnvironments.filter(
    (e) => e.freshness === "Stale",
  ).length;
  const showFreshnessBanner = staleCount / allEnvironments.length >= 0.4;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEnvironments.filter((env) => {
      if (status !== "all" && env.status !== status) return false;
      if (models.length > 0 && !models.includes(env.deploymentModel))
        return false;
      if (providers.length > 0 && !providers.includes(env.cloudProvider))
        return false;
      if (freshness.length > 0 && !freshness.includes(env.freshness))
        return false;
      if (q) {
        const haystack =
          `${env.customerName} ${env.environmentId} ${env.region} ${env.softwareVersion}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allEnvironments, query, status, models, providers, freshness]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function fireAction(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  function handleDownload() {
    const headers = [
      "Freshness",
      "Customer",
      "Environment",
      "Status",
      "Deployment Model",
      "Cloud Provider",
      "Region",
      "Version",
      "Created",
      "Last Sync",
    ];
    const rows = filtered.map((env) =>
      [
        env.freshness,
        env.customerName,
        env.environmentId,
        env.status,
        env.deploymentModel,
        env.cloudProvider,
        env.region,
        env.softwareVersion,
        formatDate(env.createdDate),
        formatDateTime(env.lastSync),
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "environments.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SubNavbar
        title="Environment Inventory"
        breadcrumb={[{ label: "Control Plane" }, { label: "Environments" }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            className="h-7"
            onClick={() => fireAction("Add Environment is not wired up yet — this is a UI placeholder.")}
          >
            <Plus size={14} />
            Add Environment
          </Button>
        }
      />

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {showFreshnessBanner && (
          <Callout
            variant="warning"
            className="mb-4"
            action={
              <button
                type="button"
                onClick={() => updateParams({ freshness: "Stale" })}
                className="whitespace-nowrap rounded-pill bg-white/60 px-3 py-1 text-[12px] font-semibold text-[#D98B1D] hover:bg-white dark:bg-white/10 dark:text-[#F5C15C] dark:hover:bg-white/20"
              >
                View stale environments
              </button>
            }
          >
            Freshness data collection appears to be broadly failing —{" "}
            {staleCount} of {allEnvironments.length} environments have not been
            verified recently.
          </Callout>
        )}

        <div className="rounded-card border border-card-border bg-card-bg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 shrink-0 text-[14px] font-semibold text-shell-text">
                Environments{" "}
                <span className="font-normal text-shell-muted">
                  ({allEnvironments.length.toLocaleString()})
                </span>
              </div>
              <Dropdown
                value={status}
                options={STATUS_OPTIONS}
                onChange={(v) => updateParams({ status: v === "all" ? null : v })}
              />
              <MultiSelectFilter
                label="Deployment model"
                options={MODEL_OPTIONS}
                selected={models}
                onApply={(v) => updateParams({ models: v.join(",") || null })}
              />
              <MultiSelectFilter
                label="Cloud provider"
                options={PROVIDER_OPTIONS}
                selected={providers}
                onApply={(v) => updateParams({ providers: v.join(",") || null })}
              />
              <MultiSelectFilter
                label="Freshness"
                options={FRESHNESS_OPTIONS}
                selected={freshness}
                onApply={(v) => updateParams({ freshness: v.join(",") || null })}
              />
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="shrink-0 whitespace-nowrap px-1 text-[12px] font-medium text-shell-muted underline-offset-2 hover:text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-nowrap items-center gap-2">
              <SearchInput
                value={query}
                onChange={(v) => updateParams({ q: v || null })}
                placeholder="Search customer, environment, region, version…"
                className="w-56 max-w-xs shrink"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleDownload}
                className="shrink-0 text-[12px]"
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <Th>Freshness</Th>
                  <Th>Customer &amp; Environment</Th>
                  <Th>Status</Th>
                  <Th>Deployment Model</Th>
                  <Th>Cloud &amp; Region</Th>
                  <Th>Version</Th>
                  <Th>Created</Th>
                  <Th>Last Sync</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-table-border">
                      {Array.from({ length: COLUMN_COUNT }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton
                            className="h-3"
                            style={{ width: `${50 + ((i + j) % 4) * 10}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading && pageRows.length === 0 && (
                  <TableEmptyState colSpan={COLUMN_COUNT} />
                )}

                {!loading &&
                  pageRows.map((env) => (
                    <tr
                      key={env.id}
                      onClick={() =>
                        navigate(`/environments/${env.id}`, {
                          state: { fromSearch: searchParams.toString() },
                        })
                      }
                      className="cursor-pointer border-t border-table-border transition-colors hover:bg-shell-hover"
                    >
                      <Td>
                        <FreshnessBadge freshness={env.freshness} />
                      </Td>
                      <Td>
                        <div className="font-semibold text-shell-text">
                          {env.customerName}
                        </div>
                        <div className="text-[12px] text-shell-muted">
                          {env.environmentId}
                        </div>
                      </Td>
                      <Td>
                        <StatusBadge status={env.status} />
                      </Td>
                      <Td>
                        <DeploymentModelPill model={env.deploymentModel} />
                      </Td>
                      <Td>
                        <CloudProviderCell
                          provider={env.cloudProvider}
                          region={env.region}
                        />
                      </Td>
                      <Td>
                        <span className="font-mono text-[12px]">
                          {env.softwareVersion}
                        </span>
                      </Td>
                      <Td>{formatDate(env.createdDate)}</Td>
                      <Td>
                        <span className="text-shell-muted">
                          {formatDateTime(env.lastSync)}
                        </span>
                      </Td>
                      <Td>
                        <ChevronRight size={16} className="text-shell-muted" />
                      </Td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-card-border px-4 py-3">
            <span className="whitespace-nowrap text-[12px] text-shell-muted">
              Showing rows {filtered.length === 0 ? 0 : pageStart + 1} to{" "}
              {Math.min(pageStart + PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-shell-muted hover:bg-shell-hover hover:text-shell-text disabled:pointer-events-none disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[12px]",
                    n === currentPage
                      ? "bg-accent text-white"
                      : "text-shell-text-2 hover:bg-shell-hover",
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-shell-muted hover:bg-shell-hover hover:text-shell-text disabled:pointer-events-none disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(totalPages)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-shell-muted hover:bg-shell-hover hover:text-shell-text disabled:pointer-events-none disabled:opacity-40"
                aria-label="Last page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
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
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap bg-table-th-bg px-4 py-2 text-left text-[12px] font-semibold uppercase tracking-wide text-shell-muted">
      {children && (
        <span className="inline-flex items-center gap-1">
          {children}
          <ChevronUp size={11} className="opacity-50" aria-hidden="true" />
        </span>
      )}
    </th>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return (
    <td className="px-4 py-3 align-middle text-shell-text-2">{children}</td>
  );
}
