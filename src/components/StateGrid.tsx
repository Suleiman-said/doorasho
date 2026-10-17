import { REGIONS, type RegionStatus } from '../data/seed'
import { CountUp } from './CountUp'

const STATUS_LABEL: Record<RegionStatus, string> = {
  voting: 'Voting',
  closed: 'Closed',
  not_started: 'Not started',
}

const STATUS_CLASS: Record<RegionStatus, string> = {
  voting: 'bg-sky text-navy',
  closed: 'bg-success text-navy',
  not_started: 'bg-white/20 text-white/70',
}

const CARD_TINT: Record<RegionStatus, string> = {
  voting: 'border-sky/50',
  closed: 'border-success/40',
  not_started: 'border-white/10',
}

type StateGridProps = {
  regionVotes: Record<string, number>
}

export function StateGrid({ regionVotes }: StateGridProps) {
  return (
    <section>
      <h2 className="font-display mb-8 text-2xl font-bold">State tracker</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((region) => (
          <article
            key={region.id}
            className={`glass rounded-2xl p-8 transition hover:-translate-y-1 hover:glow-sky ${CARD_TINT[region.status]}`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h3 className="text-lg font-medium">{region.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${STATUS_CLASS[region.status]}`}
              >
                {STATUS_LABEL[region.status]}
              </span>
            </div>
            <CountUp value={regionVotes[region.id] ?? 0} className="font-display text-3xl font-bold" />
          </article>
        ))}
      </div>
    </section>
  )
}
