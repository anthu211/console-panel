interface ManagedElsewhereChipProps {
  value: string
}

/**
 * Read-only reference chip for the k8s cluster id — muted styling + microcopy signal
 * that this is owned by a different system/epic. Deliberately not a link (no real
 * destination has been confirmed).
 */
export function ManagedElsewhereChip({ value }: ManagedElsewhereChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-card border border-dashed border-shell-border bg-shell-raised px-3 py-1.5">
      <span className="font-mono text-[12px] text-shell-muted">{value}</span>
      <span className="text-[12px] text-shell-muted">→ managed elsewhere</span>
    </div>
  )
}
