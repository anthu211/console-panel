import type { DeploymentModel } from '@/data/environments'
import { Pill } from '@/components/ui/Badge'

// Fixed mapping reused everywhere the deployment model appears — deliberately
// stays off the red/amber/green ramp (that's reserved for status/severity) and
// off grey (reads as "disabled"/unset), using three distinct DS accent hues instead.
const modelVariant: Record<DeploymentModel, 'purple' | 'blue' | 'teal'> = {
  'Prevalent Hosted': 'purple',
  'Hybrid Hosted': 'blue',
  'Client Hosted': 'teal',
}

export function DeploymentModelPill({ model }: { model: DeploymentModel }) {
  return <Pill variant={modelVariant[model]}>{model}</Pill>
}
