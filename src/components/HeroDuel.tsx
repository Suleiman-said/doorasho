import { motion } from 'framer-motion'
import type { Candidate } from '../data/seed'
import { CountUp } from './CountUp'

type HeroDuelProps = {
  first: Candidate
  second: Candidate
  firstVotes: number
  secondVotes: number
}

export function HeroDuel({ first, second, firstVotes, secondVotes }: HeroDuelProps) {
  const pair = Math.max(1, firstVotes + secondVotes)
  const firstShare = (firstVotes / pair) * 100

  return (
    <section className="glass glow-gold rounded-3xl px-6 py-12 md:px-12">
      <p className="mb-10 text-center text-sm tracking-[0.2em] text-white/60">LEADING PAIR</p>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(180px,1.4fr)_1fr]">
        <HeroFace candidate={first} votes={firstVotes} leading />
        <div className="flex flex-col gap-4">
          <div className="h-4 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky to-sky/60"
              animate={{ width: `${firstShare}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-sm text-white/60">
            <span className="tabular-nums">{Math.round(firstShare)}%</span>
            <span className="tabular-nums">{Math.round(100 - firstShare)}%</span>
          </div>
        </div>
        <HeroFace candidate={second} votes={secondVotes} leading={false} />
      </div>
    </section>
  )
}

function HeroFace({
  candidate,
  votes,
  leading,
}: {
  candidate: Candidate
  votes: number
  leading: boolean
}) {
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${leading ? '' : 'md:order-none'}`}>
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full border-4 font-display text-3xl font-bold ${
          leading ? 'glow-gold' : ''
        }`}
        style={{ borderColor: leading ? '#F59E0B' : candidate.color }}
      >
        {candidate.initials}
      </div>
      <h3 className="font-display text-2xl font-bold">{candidate.name}</h3>
      <p className="text-sm text-white/60">{candidate.party}</p>
      <CountUp value={votes} className="font-display text-3xl font-bold" />
    </div>
  )
}
