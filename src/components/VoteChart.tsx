import { motion } from 'framer-motion'
import type { Candidate } from '../data/seed'
import { CountUp } from './CountUp'

type VoteChartProps = {
  ranked: Candidate[]
  votes: Record<string, number>
  total: number
}

export function VoteChart({ ranked, votes, total }: VoteChartProps) {
  const max = Math.max(1, ...ranked.map((c) => votes[c.id] ?? 0))

  return (
    <section className="glass rounded-3xl px-6 py-10 md:px-10">
      <h2 className="font-display mb-10 text-2xl font-bold">Live tally</h2>
      <div className="flex h-72 items-end gap-6">
        {ranked.map((candidate, index) => {
          const count = votes[candidate.id] ?? 0
          const height = (count / max) * 100
          const leading = index === 0
          return (
            <div key={candidate.id} className="flex flex-1 flex-col items-center gap-4">
              <CountUp value={count} className="text-sm text-white/70" />
              <div className="flex h-52 w-full items-end">
                <motion.div
                  className={`w-full rounded-t-xl ${leading ? 'glow-gold' : ''}`}
                  style={{
                    background: `linear-gradient(180deg, ${candidate.color}, ${candidate.color}88)`,
                  }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <p className="font-display text-center text-sm font-semibold">{candidate.initials}</p>
            </div>
          )
        })}
      </div>
      <p className="mt-6 text-center text-sm text-white/40">
        Share of {total.toLocaleString('en-US')} votes
      </p>
    </section>
  )
}
