import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { CandidateCard } from '../components/CandidateCard'
import { Header } from '../components/Header'
import { CANDIDATES } from '../data/seed'
import { useElectionStore } from '../store/electionStore'

function burst() {
  const defaults = {
    spread: 70,
    ticks: 80,
    gravity: 0.85,
    origin: { y: 0.55 },
    colors: ['#38BDF8', '#F59E0B', '#FFFFFF', '#22C55E'],
    shapes: ['star' as const, 'circle' as const],
  }
  confetti({ ...defaults, particleCount: 70, scalar: 1.1 })
  confetti({ ...defaults, particleCount: 40, scalar: 0.7, spread: 120 })
}

export function VotePage() {
  const castVote = useElectionStore((s) => s.castVote)
  const [voterId, setVoterId] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  function submit() {
    if (!voterId.trim()) {
      setError('Geli lambarka aqoonsiga.')
      return
    }
    if (!selected) {
      setError('Dooro musharrax.')
      return
    }

    const result = castVote(voterId, selected)
    if (result === 'duplicate') {
      setError('Codkan horay ayaa loo diiwaan geliyey.')
      return
    }
    if (result === 'closed' || result === 'invalid') {
      setError('Ma suurtogal ah in codka la diiwaan geliyo.')
      return
    }

    setError('')
    setConfirmed(true)
    burst()
    window.setTimeout(() => {
      setConfirmed(false)
      setVoterId('')
      setSelected(null)
    }, 2200)
  }

  return (
    <div className="starfield min-h-svh">
      <Header showStation />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12">
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass glow-sky mx-auto flex min-h-[420px] w-full max-w-2xl flex-col items-center justify-center gap-6 rounded-3xl px-8 py-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-3xl text-success">
                ✓
              </div>
              <p className="font-display text-3xl font-bold text-success md:text-4xl">
                Codkaaga waa la diiwaan geliyey!
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-16"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
            >
              <div className="mx-auto w-full max-w-xl">
                <label htmlFor="voter-id" className="mb-4 block text-center text-sm tracking-wide text-white/70">
                  Lambarka aqoonsiga / Voter ID
                </label>
                <input
                  id="voter-id"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  placeholder="SO-000000"
                  className="w-full rounded-2xl border-2 border-white bg-transparent px-6 py-5 text-center font-display text-2xl tracking-widest outline-none placeholder:text-white/30 focus:glow-sky"
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                {CANDIDATES.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    selected={selected === candidate.id}
                    onSelect={() => setSelected(candidate.id)}
                  />
                ))}
              </div>

              {error && <p className="text-center text-sm text-gold">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl bg-sky py-5 font-display text-lg font-bold text-navy transition hover:glow-sky"
              >
                Diiwaan geli codka
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
