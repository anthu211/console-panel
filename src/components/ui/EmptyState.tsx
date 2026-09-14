interface TableEmptyStateProps {
  colSpan: number
  heading?: string
  subtext?: string
}

/** state-empty-table — 🚦 only, never 🚧. Keeps thead + pagination visible (rendered by caller). */
export function TableEmptyState({
  colSpan,
  heading = 'No Data… For Now!',
  subtext = 'No records match your current filters. Try adjusting your search.',
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        <div className="mb-3 text-[28px]" aria-hidden="true">
          🚦
        </div>
        <div className="mb-1.5 text-[14px] font-semibold text-shell-text">{heading}</div>
        <div className="text-[12px] text-shell-muted">{subtext}</div>
      </td>
    </tr>
  )
}
