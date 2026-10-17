import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { CandidateRow } from '../components/CandidateRow'
import { CountUp } from '../components/CountUp'
import { Header } from '../components/Header'
import { HeroDuel } from '../components/HeroDuel'
import { StateGrid } from '../components/StateGrid'
import { VoteChart } from '../components/VoteChart'
import { rankedCandidates, totalVotes, useElectionStore } from '../store/electionStore'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export function DashboardPage() {
  const candidateVotes = useElectionStore((s) => s.candidateVotes)
  const regionVotes = useElectionStore((s) => s.regionVotes)
  const simulateIncomingVote = useElectionStore((s) => s.simulateIncomingVote)

  const total = totalVotes(candidateVotes)
  const ranked = rankedCandidates(candidateVotes)
  const [first, second] = ranked

  useEffect(() => {
    const lockKey = 'doorashada-sim-lock'
    const id = crypto.randomUUID()

    const claim = () => {
      const raw = localStorage.getItem(lockKey)
      const parsed = raw ? (JSON.parse(raw) as { id: string; at: number }) : null
      if (!parsed || Date.now() - parsed.at > 15000) {
        localStorage.setItem(lockKey, JSON.stringify({ id, at: Date.now() }))
        return true
      }
      return parsed.id === id
    }

    claim()
    const heartbeat = window.setInterval(() => {
      if (claim()) {
        localStorage.setItem(lockKey, JSON.stringify({ id, at: Date.now() }))
      }
    }, 4000)
    const timer = window.setInterval(() => {
      if (claim()) simulateIncomingVote()
    }, 9000)

    return () => {
      window.clearInterval(timer)
      window.clearInterval(heartbeat)
      const raw = localStorage.getItem(lockKey)
      if (raw && (JSON.parse(raw) as { id: string }).id === id) {
        localStorage.removeItem(lockKey)
      }
    }
  }, [simulateIncomingVote])

  return (
    <div className="starfield min-h-svh">
      <Header />
      <motion.main
        className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-10 pb-24"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.section variants={fadeUp} className="text-center">
          <p className="mb-4 text-sm tracking-[0.25em] text-white/50">TOTAL VOTES COUNTED</p>
          <CountUp value={total} className="font-display text-5xl font-bold md:text-7xl" />
        </motion.section>

        {first && second && (
          <motion.div variants={fadeUp}>
            <HeroDuel
              first={first}
              second={second}
              firstVotes={candidateVotes[first.id] ?? 0}
              secondVotes={candidateVotes[second.id] ?? 0}
            />
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex flex-col gap-8">
          {ranked.map((candidate, index) => {
            const votes = candidateVotes[candidate.id] ?? 0
            const percent = total === 0 ? 0 : (votes / total) * 100
            return (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                votes={votes}
                percent={percent}
                leading={index === 0}
              />
            )
          })}
        </motion.div>

        <motion.div variants={fadeUp}>
          <VoteChart ranked={ranked} votes={candidateVotes} total={total} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StateGrid regionVotes={regionVotes} />
        </motion.div>
      </motion.main>
    </div>
  )
}
