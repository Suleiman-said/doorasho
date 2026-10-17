import { motion } from 'framer-motion'
import type { Candidate } from '../data/seed'
import { CountUp } from './CountUp'

type CandidateRowProps = {
  candidate: Candidate
  votes: number
  percent: number
  leading: boolean
}

export function CandidateRow({ candidate, votes, percent, leading }: CandidateRowProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className={`glass rounded-2xl px-6 py-6 ${leading ? 'glow-gold border-gold' : 'hover:glow-sky'}`}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border-4 font-display font-bold"
            style={{ borderColor: leading ? '#F59E0B' : candidate.color }}
          >
            {candidate.initials}
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{candidate.name}</p>
            <p className="text-sm text-white/50">{candidate.party}</p>
          </div>
        </div>
        <div className="text-right">
          <CountUp value={votes} className="font-display text-2xl font-bold" />
          <p className="tabular-nums text-sm text-white/50">{percent.toFixed(1)}%</p>
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: leading
              ? 'linear-gradient(90deg, #F59E0B, #FDE68A)'
              : 'linear-gradient(90deg, #38BDF8, #7DD3FC)',
          }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </motion.article>
  )
}
