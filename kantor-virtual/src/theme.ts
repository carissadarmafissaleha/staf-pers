/** theme.ts — Office TV theme pack (characters, rooms, chatter, names, events) */

import { useSyncExternalStore } from 'react'
import { getVariant, pickIncidentLine, type IncidentLineKind } from './incident'

export type ThemeName = 'default' | 'office'

// Why: 27 Office characters — shuffle-dealt to roles. Sprites live at
// /sprites/office/characters/{slug}-{front|rear}-{left|right}.png
const OFFICE_CHARACTERS = [
  'andy-bernard', 'angela-martin', 'bob-vance', 'carol-stills',
  'creed-bratton', 'darryl-philbin', 'david-wallace', 'dwight-schrute',
  'erin-hannon', 'gabe-lewis', 'holly-flax', 'jan-levinson',
  'jim-halpert', 'karen-filippelli', 'kelly-kapoor', 'kevin-malone',
  'meredith-palmer', 'michael-scott', 'nellie-bertram', 'oscar-martinez',
  'pam-beesly', 'phyllis-vance', 'robert-california', 'roy-anderson',
  'ryan-howard', 'stanley-hudson', 'toby-flenderson',
] as const

const OFFICE_CATS = [
  'cat-bandit', 'cat-bandits-kittens', 'cat-comstock', 'cat-comstock-alt',
  'cat-ember', 'cat-garbage', 'cat-mr-ash', 'cat-mr-ash-alt',
  'cat-phillip', 'cat-princess-lady', 'cat-princess-lady-alt', 'cat-sprinkles',
]

// Fixed casting by role — same character used for Slack avatar AND room sprite
const FIXED_ROLE_CASTING: Record<string, string> = {
  boss: 'Frontend-dev-1',
  assistant: 'employee-2',
}

interface ThemeState {
  name: ThemeName
  // Role → Office character slug. Keyed by role so SlackChat (role) and
  // Character.tsx (agent.role) resolve to the same cast.
  castByRole: Record<string, string>
  angelaRole: string | null
  angelaCat: string | null
}

// Why: declared before `state` — loadInitial() runs at module load and reads them
const THEME_KEY = 'agent-office-theme'
const CAST_KEY = 'agent-office-cast'

let state: ThemeState = loadInitial()
const listeners = new Set<() => void>()

function loadInitial(): ThemeState {
  const base: ThemeState = { name: 'default', castByRole: {}, angelaRole: null, angelaCat: null }
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'office') base.name = 'office'
    // Why: the cast is restored with the theme so a reload (or /the-office
    // off → on) keeps every role's character instead of re-dealing (C47)
    const cast = JSON.parse(localStorage.getItem(CAST_KEY) ?? 'null')
    if (cast && typeof cast === 'object' && cast.castByRole && typeof cast.castByRole === 'object') {
      const castByRole: Record<string, string> = {}
      for (const [role, slug] of Object.entries(cast.castByRole)) {
        if (typeof slug === 'string' && (OFFICE_CHARACTERS as readonly string[]).includes(slug)) castByRole[role] = slug
      }
      base.castByRole = castByRole
      base.angelaRole = typeof cast.angelaRole === 'string' && castByRole[cast.angelaRole] === 'angela-martin' ? cast.angelaRole : null
      base.angelaCat = base.angelaRole && typeof cast.angelaCat === 'string' && OFFICE_CATS.includes(cast.angelaCat) ? cast.angelaCat : null
    }
  } catch {}
  return base
}

function persist() {
  try {
    localStorage.setItem(THEME_KEY, state.name)
    localStorage.setItem(CAST_KEY, JSON.stringify({ castByRole: state.castByRole, angelaRole: state.angelaRole, angelaCat: state.angelaCat }))
  } catch {}
}

function emit() { listeners.forEach(l => l()) }

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a as T[]
}
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export function getTheme(): ThemeName { return state.name }

export function setTheme(name: ThemeName) {
  if (state.name === name) return
  // Why: the cast survives a toggle, so turning the Office theme off and on
  // again brings the same characters back
  state = { ...state, name }
  persist()
  emit()
}

export function toggleTheme() {
  setTheme(state.name === 'office' ? 'default' : 'office')
}

export function subscribeTheme(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme(): ThemeName {
  return useSyncExternalStore(
    (cb) => subscribeTheme(cb),
    () => state.name,
    () => 'default',
  )
}

function dealt(): Set<string> { return new Set(Object.values(state.castByRole)) }

/** Assign (or return existing) Office character for a role. Same for SlackChat & Character. */
export function getCharacterBaseForRole(role: string, defaultBase: string, agentId?: string): string {
  try {
    const custom = JSON.parse(localStorage.getItem('nara-char-sprites') || '{}');
    if (agentId && custom[agentId]) return custom[agentId];
    if (custom[role]) return custom[role];
    if (agentId && custom[agentId.toLowerCase()]) return custom[agentId.toLowerCase()];
    if (role && custom[role.toLowerCase()]) return custom[role.toLowerCase()];
    if (agentId && (agentId === 'boss' || agentId.startsWith('boss-')) && custom['boss']) return custom['boss'];
    if (agentId && (agentId === 'assistant' || agentId.startsWith('assistant')) && custom['assistant']) return custom['assistant'];
    if ((agentId === 'pasi-pers' || (role && (role.toLowerCase().includes('pasi') || role.toLowerCase().includes('personalia')))) && custom['pasi-pers']) return custom['pasi-pers'];
    if ((agentId === 'sertu-ricat' || (role && role.toLowerCase().includes('surat b'))) && custom['sertu-ricat']) return custom['sertu-ricat'];
    if ((agentId === 'pratu-yacob' || (role && role.toLowerCase().includes('sisfopers'))) && custom['pratu-yacob']) return custom['pratu-yacob'];
    if ((agentId === 'pratu-lalaun' || (role && (role.toLowerCase().includes('kima') || role.toLowerCase().includes('nikah')))) && custom['pratu-lalaun']) return custom['pratu-lalaun'];
  } catch {}
  if (state.name !== 'office') return defaultBase
  if (state.castByRole[role]) return state.castByRole[role]

  // Fixed casting wins
  const fixed = FIXED_ROLE_CASTING[role]
  if (fixed) {
    state.castByRole[role] = fixed
    return fixed
  }

  // Pick from remaining — exclude already-dealt + reserved-fixed-not-yet-used
  const used = dealt()
  const reservedNotYetUsed = new Set(
    Object.values(FIXED_ROLE_CASTING).filter(c => !used.has(c))
  )
  const pool = OFFICE_CHARACTERS.filter(c => !used.has(c) && !reservedNotYetUsed.has(c))
  // Fallback when all 22 are dealt: reuse an existing non-fixed cast slug.
  // Why: prevents duplicating boss (Michael) or assistant (Jim) on screen when chat roles overflow.
  const fixedSet = new Set(Object.values(FIXED_ROLE_CASTING))
  const nonFixedUsed = [...used].filter(c => !fixedSet.has(c))
  const chosen = pool.length > 0
    ? pick(pool as string[])
    : (nonFixedUsed.length > 0 ? pick(nonFixedUsed) : OFFICE_CHARACTERS[2]) // Why: [2] is not Michael/Jim
  state.castByRole[role] = chosen

  if (chosen === 'angela-martin') {
    state.angelaRole = role
    state.angelaCat = pick(OFFICE_CATS)
  }
  persist()
  return chosen
}

export function getSpriteDir(): string {
  return state.name === 'office' ? '/sprites/office/characters' : '/sprites/characters'
}

/** Returns sprite path based on agentId or role, checking both default and office character pools. */
export function getSpritePath(agentId: string, role: string, defaultBase: string, direction: string): string {
  const base = getCharacterBaseForRole(role, defaultBase, agentId);
  const isOffice = (OFFICE_CHARACTERS as readonly string[]).includes(base);
  const dir = isOffice ? '/sprites/office/characters' : '/sprites/characters';
  return `${dir}/${base}-${direction}.png`;
}

export function getRoomImage(phase: 'day' | 'night'): string {
  if (state.name === 'office') {
    return phase === 'night' ? '/rooms/office-night-dm.png' : '/rooms/office-day-dm.png'
  }
  return phase === 'night' ? '/rooms/office-night.png' : '/rooms/office-day.png'
}

/** Returns the ROLE currently cast as Angela (if any), plus cat sprite path. */
export function getAngelaCat(): { role: string; catSprite: string } | null {
  if (state.name !== 'office' || !state.angelaRole || !state.angelaCat) return null
  return { role: state.angelaRole, catSprite: `/sprites/office/cats/${state.angelaCat}.png` }
}

/** Human-readable display name for a slug (e.g. "michael-scott" → "Michael Scott") */
function slugToName(slug: string): string {
  return slug.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join(' ')
}

/** Swap sender display name to the cast Office character when theme is active. */
export function themedDisplayName(role: string, fallback: string): string {
  if (state.name !== 'office') return fallback
  const cast = state.castByRole[role]
  if (!cast) {
    // Force-assign so the name matches the avatar on first render
    const base = getCharacterBaseForRole(role, '')
    return slugToName(base)
  }
  return slugToName(cast)
}

// ===== THEMED CHATTER POOLS =====

const OFFICE_SPAWN = [
  'Siap melaksanakan tugas staf administrasi!',
  'Pelayanan naskah dinas Spers Yonif 735 aktif',
  'Buka agenda surat masuk dan permohonan izin jalan',
  'Periksa dosir dan buku register cuti personel',
  'Siapkan konsep Surat Bentuk B sesuai Jukminu',
  'Standby dinas administrasi staf pers',
]
const OFFICE_WORK = [
  'Mengetik konsep Surat Bentuk B di komputer',
  'Mengecek NRP, Pangkat, dan Jabatan di nominatif',
  'Menghitung hari kerja kalender cuti prajurit',
  'Memeriksa kelengkapan berkas permohonan izin',
  'Menata tata letak surat dan margin dinas militer',
  'Verifikasi nomor surat dan tembusan Kotama',
]
const OFFICE_DONE = [
  'Surat Bentuk B selesai dicetak rapi!',
  'Format tata naskah presisi 100% sesuai standar!',
  'Dokumen diajukan untuk paraf Pasi Pers',
  'Berkas izin jalan siap ditandatangani Danyonif',
  'Pengarsipan dosir prajurit selesai',
]
const OFFICE_COFFEE = [
  'Rehat kopi sejenak di ruang staf pers',
  'Ngopi santai setelah menyelesaikan naskah dinas',
  'Refill kopi biar makin teliti memeriksa nomor surat',
]
const OFFICE_WATER = [
  'Minum air dulu biar tetap fokus dinas',
  'Jeda minum sejenak di meja staf',
  'Segar kembali, lanjut ketik Surat Bentuk B',
]

const DEFAULT_SPAWN = [
  'Siap melaksanakan tugas staf administrasi!',
  'Pelayanan naskah dinas Spers Yonif 735 aktif',
  'Buka agenda surat masuk dan permohonan izin jalan',
  'Periksa dosir dan buku register cuti personel',
  'Siapkan konsep Surat Bentuk B sesuai Jukminu',
  'Standby dinas administrasi staf pers',
]
const DEFAULT_WORK = [
  'Mengetik konsep Surat Bentuk B di komputer',
  'Mengecek NRP, Pangkat, dan Jabatan di nominatif',
  'Menghitung hari kerja kalender cuti prajurit',
  'Memeriksa kelengkapan berkas permohonan izin',
  'Menata tata letak surat dan margin dinas militer',
  'Verifikasi nomor surat dan tembusan Kotama',
]
const DEFAULT_DONE = [
  'Surat Bentuk B selesai dicetak rapi!',
  'Format tata naskah presisi 100% sesuai standar!',
  'Dokumen diajukan untuk paraf Pasi Pers',
  'Berkas izin jalan siap ditandatangani Danyonif',
  'Pengarsipan dosir prajurit selesai',
]
const DEFAULT_COFFEE = ['Ngopi dulu sejenak di ruang staf', 'Refill kopi biar makin teliti', 'Jeda kopi sambil periksa naskah']
const DEFAULT_WATER = [
  'Minum air dulu biar tetap fokus dinas',
  'Jeda minum sejenak di meja staf',
  'Segar kembali, lanjut ketik Surat Bentuk B',
]

// Pool order: incident variant (while active) → theme → default. Under
// Dunder Mifflin + incident it is 50/50 so Michael stays in character.
function variantLine(kind: IncidentLineKind): string | null {
  if (getVariant() !== 'incident') return null
  if (state.name === 'office' && Math.random() < 0.5) return null
  return pickIncidentLine(kind)
}

export function themedSpawn(): string  { return variantLine('spawn')  ?? pick(state.name === 'office' ? OFFICE_SPAWN  : DEFAULT_SPAWN) }
export function themedWork(): string   { return variantLine('work')   ?? pick(state.name === 'office' ? OFFICE_WORK   : DEFAULT_WORK) }
export function themedDone(): string   { return variantLine('done')   ?? pick(state.name === 'office' ? OFFICE_DONE   : DEFAULT_DONE) }
export function themedCoffee(): string { return variantLine('coffee') ?? pick(state.name === 'office' ? OFFICE_COFFEE : DEFAULT_COFFEE) }
export function themedWater(): string  { return variantLine('water')  ?? pick(state.name === 'office' ? OFFICE_WATER  : DEFAULT_WATER) }

// ===== SIM / VIDEO MODE OFFICE SCRIPT =====
// Parallel tool-output messages keyed by role — used when ?sim or ?video loads with Office theme.
export const OFFICE_SIM_TOOL_MESSAGES: Record<string, string[]> = {
  'security-auditor': [
    '⚡ memeriksa keamanan dosir dan arsip rahasia personel',
    '⚠️ periksa kelengkapan fotokopi KTA prajurit yang mengajukan cuti',
    '🚨 verifikasi klasifikasi naskah dinas: Rahasia / Terbatas',
    'amankan buku register dan dosir sebelum jam dinas berakhir',
  ],
  'code-reviewer': [
    '⚡ memeriksa draf naskah Surat Bentuk B sesuai Jukminu TNI',
    '🔍 meneliti kesesuaian NRP, pangkat, kompi, dan nama pengikut',
    '💡 sesuaikan tembusan surat ke Danrem dan Pangdam',
    'format naskah dinas valid dan disetujui untuk tanda tangan Komandan',
  ],
  'frontend-developer': [
    '⚡ mengatur tata letak naskah, kop surat, dan margin dinas',
    '🎨 pastikan jenis huruf Arial 12pt dan spasi 1.5 rapi',
    'hitung 23 hari kerja cuti agar tidak terhitung hari Minggu dan libur',
    'draf Surat Bentuk B siap dicetak untuk diajukan ke Pasi Pers',
  ],
  'assistant': [
    'printer macet lagi, kertas tersangkut di penarik baki cetak dinas',
    'tolong periksa tinta dan drum mesin cetak naskah',
    'semua konsep surat dinas hari ini sudah diregistrasi di agenda',
  ],
  'boss': [
    'seluruh personel staf pers, kumpul sebentar untuk briefing pengarahan!',
    'pastikan semua permohonan cuti dan izin nikah terlayani dengan tertib.',
    'cek kembali tanda tangan dan cap dinas sebelum surat dikirimkan.',
    'bagaimana perkembangan pemrosesan surat dinas hari ini?',
  ],
}

/** Sim replacement for Antony's typed questions, when theme is Office */
export const OFFICE_SIM_BOSS_PROMPTS = [
  'Sertu Ricat, buatkan Surat B pengajuan cuti tahunan personel Kima',
  'Pratu Yacob, cek nominatif prajurit yang mengajukan SIJ luar Kotama',
]

// ===== Rotation helpers for the Office ?sim rotation =====

export function getAllOfficeCharacters(): readonly string[] { return OFFICE_CHARACTERS }

/** Force a specific role → character mapping (used by sim rotation). */
export function assignCharacterToRole(role: string, slug: string) {
  state.castByRole[role] = slug
  if (slug === 'angela-martin') {
    state.angelaRole = role
    state.angelaCat = pick(OFFICE_CATS)
  }
  persist()
  emit()
}

/** Release a role's cast slot so another role can use that character later. */
export function releaseRole(role: string) {
  const slug = state.castByRole[role]
  if (!slug) return
  delete state.castByRole[role]
  if (state.angelaRole === role) {
    state.angelaRole = null
    state.angelaCat = null
  }
  persist()
  emit()
}

/** Return the set of character slugs currently on-screen (dealt to some role). */
export function getActiveCastSlugs(): Set<string> {
  return new Set(Object.values(state.castByRole))
}

/**
 * Pick the next unused Office character — cycles fairly through all 22 over time.
 * @param ignoreSet  extra slugs to avoid (e.g. just-used)
 */
export function nextUnusedOfficeCharacter(ignoreSet: Set<string> = new Set()): string {
  const used = getActiveCastSlugs()
  const avail = OFFICE_CHARACTERS.filter(c => !used.has(c) && !ignoreSet.has(c))
  if (avail.length > 0) return pick(avail as string[])
  // All 22 on-screen: pick any not in the ignore set
  const fallback = OFFICE_CHARACTERS.filter(c => !ignoreSet.has(c))
  return fallback.length > 0 ? pick(fallback as string[]) : OFFICE_CHARACTERS[0]
}

/** Display name for a slug — used when renaming sim staff on spawn. */
export function displayNameFromSlug(slug: string): string {
  return slug.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join(' ')
}

// Character-specific prop overlays — replace the energy-drink bubble above cast members.
// Why: visual easter eggs tying props to iconic bits. Each slug maps to a pool
// of signature props — when there's more than one, a deterministic hash picks
// per-role so the same agent keeps the same prop within a session.
const OFFICE_PROPS_BY_SLUG: Record<string, string[]> = {
  'michael-scott':   [
    '/sprites/office/props/worlds-best-boss-mug.png',
    '/sprites/office/props/dundie-award.png',
    '/sprites/office/props/golden-ticket-box.png',
    '/sprites/office/props/prison-mike.png',
    '/sprites/office/props/no-god-please-no.png',
  ],
  'dwight-schrute':  [
    '/sprites/office/props/cpr-dummy-mask.png',
    '/sprites/office/props/schrute-buck.png',
  ],
  'jim-halpert':     ['/sprites/office/props/jello-stapler.png'],
  'stanley-hudson':  ['/sprites/office/props/pretzel-day.png'],
  'jan-levinson':    ['/sprites/office/props/serenity-by-jan-candle.png'],
  // Why: Finer Things Club members share the prop — Oscar, Pam, and Toby.
  'oscar-martinez':  ['/sprites/office/props/finer-things-club.png'],
  'pam-beesly':      ['/sprites/office/props/finer-things-club.png'],
  'toby-flenderson': ['/sprites/office/props/finer-things-club.png'],
  // Angela: randomized second cat assigned per-role below — not a prop file.
}

// Why: generic fallback for remaining cast so every Office character has a prop.
const OFFICE_GENERIC_PROPS = [
  '/sprites/office/props/dunder-mifflin-logo.png',
  '/sprites/office/props/dunder-mifflin-paper-box.png',
  '/sprites/office/props/schrute-buck.png',
  '/sprites/office/props/golden-ticket-box.png',
]

const OFFICE_CATS_PATHS = OFFICE_CATS.map(c => `/sprites/office/cats/${c}.png`)

// Stable per-role generic prop / head-cat assignment — deterministic hash so it doesn't flicker.
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Prop sprite override for a given role's cast, or null to fall back to energy drink. */
export function getOfficePropForRole(role: string): string | null {
  if (state.name !== 'office') return null
  const slug = state.castByRole[role]
  if (!slug) return null

  // Angela: show a different cat above her head (head-cat, separate from her follower cat)
  if (slug === 'angela-martin') {
    const idx = hashString(role + 'head') % OFFICE_CATS_PATHS.length
    return OFFICE_CATS_PATHS[idx]
  }

  const specificPool = OFFICE_PROPS_BY_SLUG[slug]
  if (specificPool && specificPool.length > 0) {
    // Why: hash by role + slug so each cast member keeps a stable prop pick
    return specificPool[hashString(role + slug) % specificPool.length]
  }

  // Generic fallback: dunder logo / Schrute buck / golden ticket, deterministic per slug
  return OFFICE_GENERIC_PROPS[hashString(slug) % OFFICE_GENERIC_PROPS.length]
}
