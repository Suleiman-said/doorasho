import { motion } from 'framer-motion'
import type { Candidate } from '../data/seed'

type CandidateCardProps = {
  candidate: Candidate
  selected: boolean
  onSelect: () => void
}

export function CandidateCard({ candidate, selected, onSelect }: CandidateCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`glass flex w-full flex-col items-center gap-5 rounded-2xl px-6 py-8 text-center ${
        selected ? 'glow-sky border-sky' : 'hover:glow-sky'
      }`}
      style={{ borderColor: selected ? '#38BDF8' : undefined }}
    >
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border-4 font-display text-2xl font-bold"
        style={{ borderColor: candidate.color, boxShadow: `0 0 18px ${candidate.color}55` }}
      >
        {candidate.initials}
      </div>
      <div>
        <p className="font-display text-xl font-semibold">{candidate.name}</p>
        <p className="mt-2 text-sm text-white/60">{candidate.party}</p>
      </div>
    </motion.button>
  )
}
