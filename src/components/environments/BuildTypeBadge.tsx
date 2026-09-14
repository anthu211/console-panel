import { CircleAlert, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { BuildType } from '@/data/environments'
import { cn } from '@/lib/utils'

const config: Record<BuildType, { classes: string; icon: typeof ShieldCheck; helper: string }> = {
  Stable: {
    classes: 'bg-[#EFF7ED] text-[#1A7D4D] border-[rgba(49,165,109,0.3)] dark:bg-[#192C15]',
    icon: ShieldCheck,
    helper: 'Standard release build',
  },
  'Non-release': {
    classes: 'bg-[#FEF3C7] text-[#92600E] border-[rgba(217,139,29,0.5)] dark:bg-[#514B09]',
    icon: TriangleAlert,
    helper: 'Running a non-standard build — verify this is intentional',
  },
  Beta: {
    classes: 'bg-[#F9EEEE] text-[#D12329] border-[rgba(209,35,41,0.4)] dark:bg-[#260808]',
    icon: CircleAlert,
    helper: 'Running a beta build — verify this is intentional',
  },
}

/**
 * Strongest visual treatment on the page after the freshness badge — this exists
 * specifically to surface environments silently left on non-standard builds, so
 * non-release/beta must never read as a neutral/gray tag.
 */
export function BuildTypeBadge({ buildType }: { buildType: BuildType }) {
  const { classes, icon: Icon, helper } = config[buildType]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-card border px-3 py-1.5 text-[14px] font-semibold',
        classes,
      )}
      title={helper}
    >
      <Icon size={16} strokeWidth={2.5} />
      {buildType}
    </span>
  )
}
