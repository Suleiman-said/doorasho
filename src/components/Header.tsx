import { NavLink } from 'react-router-dom'
import { REGIONS } from '../data/seed'
import { useElectionStore } from '../store/electionStore'
import { LiveBadge } from './LiveBadge'

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
      <path d="M12 2.2l2.4 7.3h7.7l-6.2 4.5 2.4 7.3L12 16.8 5.7 21.3l2.4-7.3L1.9 9.5h7.7z" />
    </svg>
  )
}

export function Header({ showStation = false }: { showStation?: boolean }) {
  const stationRegionId = useElectionStore((s) => s.stationRegionId)
  const setStationRegion = useElectionStore((s) => s.setStationRegion)
  const votingRegions = REGIONS.filter((region) => region.status === 'voting')

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pt-8 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <StarIcon />
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Doorashada
        </h1>
        <LiveBadge />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {showStation && (
          <label className="flex items-center gap-3 text-sm text-white/70">
            Station
            <select
              value={stationRegionId}
              onChange={(e) => setStationRegion(e.target.value)}
              className="glass rounded-xl px-4 py-2 text-white outline-none"
            >
              {votingRegions.map((region) => (
                <option key={region.id} value={region.id} className="bg-navy text-white">
                  {region.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <nav className="flex gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-xl px-5 py-2 text-sm font-medium transition ${
                isActive ? 'bg-sky text-navy glow-sky' : 'glass text-white hover:bg-white/10'
              }`
            }
          >
            Vote
          </NavLink>
          <NavLink
            to="/live"
            className={({ isActive }) =>
              `rounded-xl px-5 py-2 text-sm font-medium transition ${
                isActive ? 'bg-sky text-navy glow-sky' : 'glass text-white hover:bg-white/10'
              }`
            }
          >
            Live
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
