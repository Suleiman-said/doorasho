import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { VotePage } from './pages/VotePage'
import { useElectionStore } from './store/electionStore'

export default function App() {
  const hydrate = useElectionStore((s) => s.hydrate)
  const hydrated = useElectionStore((s) => s.hydrated)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return <div className="starfield min-h-svh" />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotePage />} />
        <Route path="/live" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
