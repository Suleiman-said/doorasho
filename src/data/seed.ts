export type Candidate = {
  id: string
  name: string
  party: string
  initials: string
  color: string
}

export type RegionStatus = 'voting' | 'closed' | 'not_started'

export type Region = {
  id: string
  name: string
  status: RegionStatus
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'ahmed',
    name: 'Axmed Nuur Xasan',
    party: 'Hoggaan',
    initials: 'AN',
    color: '#38BDF8',
  },
  {
    id: 'fadumo',
    name: 'Fadumo Cali Warsame',
    party: 'Wadajir',
    initials: 'FW',
    color: '#A78BFA',
  },
  {
    id: 'mohamed',
    name: 'Maxamed Yuusuf Barre',
    party: 'Midnimo',
    initials: 'MB',
    color: '#F472B6',
  },
  {
    id: 'amina',
    name: 'Aamina Cabdi Faarax',
    party: 'Horumar',
    initials: 'AF',
    color: '#34D399',
  },
]

export const REGIONS: Region[] = [
  { id: 'banadir', name: 'Banadir', status: 'voting' },
  { id: 'puntland', name: 'Puntland', status: 'voting' },
  { id: 'jubaland', name: 'Jubaland', status: 'closed' },
  { id: 'koonfur', name: 'Koonfur Galbeed', status: 'voting' },
  { id: 'galmudug', name: 'Galmudug', status: 'not_started' },
  { id: 'hirshabelle', name: 'Hirshabelle', status: 'closed' },
]

export const SEED_CANDIDATE_VOTES: Record<string, number> = {
  ahmed: 18420,
  fadumo: 16110,
  mohamed: 9780,
  amina: 7340,
}

export const SEED_REGION_VOTES: Record<string, number> = {
  banadir: 21400,
  puntland: 12680,
  jubaland: 8920,
  koonfur: 6420,
  galmudug: 0,
  hirshabelle: 2230,
}

export const CHANNEL_NAME = 'doorashada-election'
export const STORAGE_KEY = 'doorashada-election-v1'
