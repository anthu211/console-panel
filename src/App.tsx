import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EnvironmentDetails } from '@/pages/EnvironmentDetails'
import { EnvironmentInventory } from '@/pages/EnvironmentInventory'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/environments" replace />} />
        <Route path="/environments" element={<EnvironmentInventory />} />
        <Route path="/environments/:id" element={<EnvironmentDetails />} />
      </Routes>
    </AppShell>
  )
}
