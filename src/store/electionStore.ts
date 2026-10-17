import { create } from 'zustand'
import {
  CANDIDATES,
  CHANNEL_NAME,
  REGIONS,
  SEED_CANDIDATE_VOTES,
  SEED_REGION_VOTES,
  STORAGE_KEY,
} from '../data/seed'

export type CastResult = 'ok' | 'duplicate' | 'invalid' | 'closed'

type PersistedState = {
  candidateVotes: Record<string, number>
  regionVotes: Record<string, number>
  usedVoterIds: string[]
  stationRegionId: string
}

type ElectionState = PersistedState & {
  hydrated: boolean
  hydrate: () => void
  setStationRegion: (regionId: string) => void
  castVote: (voterId: string, candidateId: string) => CastResult
  ingestRemote: (state: PersistedState) => void
  simulateIncomingVote: () => void
}

const defaultStation = REGIONS.find((region) => region.status === 'voting')?.id ?? 'banadir'

const emptyPersist = (): PersistedState => ({
  candidateVotes: { ...SEED_CANDIDATE_VOTES },
  regionVotes: { ...SEED_REGION_VOTES },
  usedVoterIds: [],
  stationRegionId: defaultStation,
})

let channel: BroadcastChannel | null = null
let applyingRemote = false

function snapshot(state: PersistedState): PersistedState {
  return {
    candidateVotes: { ...state.candidateVotes },
    regionVotes: { ...state.regionVotes },
    usedVoterIds: [...state.usedVoterIds],
    stationRegionId: state.stationRegionId,
  }
}

function persist(state: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot(state)))
  if (!applyingRemote && channel) {
    channel.postMessage(snapshot(state))
  }
}

function loadPersist(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyPersist()
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const base = emptyPersist()
    return {
      candidateVotes: { ...base.candidateVotes, ...parsed.candidateVotes },
      regionVotes: { ...base.regionVotes, ...parsed.regionVotes },
      usedVoterIds: parsed.usedVoterIds ?? [],
      stationRegionId: parsed.stationRegionId ?? defaultStation,
    }
  } catch {
    return emptyPersist()
  }
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  ...emptyPersist(),
  hydrated: false,
  hydrate: () => {
    const loaded = loadPersist()
    set({ ...loaded, hydrated: true })
    if (typeof BroadcastChannel !== 'undefined' && !channel) {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = (event: MessageEvent<PersistedState>) => {
        applyingRemote = true
        get().ingestRemote(event.data)
        applyingRemote = false
      }
    }
  },
  ingestRemote: (state) => {
    set({
      candidateVotes: state.candidateVotes,
      regionVotes: state.regionVotes,
      usedVoterIds: state.usedVoterIds,
      stationRegionId: state.stationRegionId,
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot(state)))
  },
  setStationRegion: (regionId) => {
    set({ stationRegionId: regionId })
    persist(get())
  },
  castVote: (voterId, candidateId) => {
    const id = voterId.trim().toUpperCase()
    if (!id || !CANDIDATES.some((c) => c.id === candidateId)) return 'invalid'
    if (get().usedVoterIds.includes(id)) return 'duplicate'

    const region = REGIONS.find((item) => item.id === get().stationRegionId)
    if (!region || region.status !== 'voting') return 'closed'

    const candidateVotes = {
      ...get().candidateVotes,
      [candidateId]: (get().candidateVotes[candidateId] ?? 0) + 1,
    }
    const regionVotes = {
      ...get().regionVotes,
      [region.id]: (get().regionVotes[region.id] ?? 0) + 1,
    }
    const usedVoterIds = [...get().usedVoterIds, id]
    set({ candidateVotes, regionVotes, usedVoterIds })
    persist(get())
    return 'ok'
  },
  simulateIncomingVote: () => {
    const open = REGIONS.filter((region) => region.status === 'voting')
    if (open.length === 0) return
    const region = open[Math.floor(Math.random() * open.length)]
    const candidate = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)]
    const ghostId = `SIM-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
    const candidateVotes = {
      ...get().candidateVotes,
      [candidate.id]: (get().candidateVotes[candidate.id] ?? 0) + 1,
    }
    const regionVotes = {
      ...get().regionVotes,
      [region.id]: (get().regionVotes[region.id] ?? 0) + 1,
    }
    const usedVoterIds = [...get().usedVoterIds, ghostId]
    set({ candidateVotes, regionVotes, usedVoterIds })
    persist(get())
  },
}))

export function totalVotes(votes: Record<string, number>) {
  return Object.values(votes).reduce((sum, n) => sum + n, 0)
}

export function rankedCandidates(votes: Record<string, number>) {
  return [...CANDIDATES].sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0))
}
