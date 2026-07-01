const BASE = 'https://pokedex-django-backend-production.up.railway.app/api'

// ── Types ────────────────────────────────────────────────────────────────────

export type TeamMember = {
  id:       number
  team:     number
  pokemon:  number   // pokédex ID
  position: number   // 1–6
  nickname: string
}

export type Team = {
  id:         number
  user:       number
  name:       string
  favorite:   boolean
  created_at: string
  members:    TeamMember[]
}

type TeamsListResponse = {
  count:    number
  next:     string | null
  previous: string | null
  results:  Team[]
}

// ── Sprite helper ────────────────────────────────────────────────────────────

export type PokemonSprite = {
  id:             number
  name:           string
  sprite:         string
  animatedSprite: string | null
  types:          string[]
}

export async function fetchPokemonSprite(id: number): Promise<PokemonSprite> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) throw new Error(`Pokemon ${id} not found`)
  const d = await res.json()
  return {
    id:   d.id,
    name: d.name,
    sprite: d.sprites.front_default ?? '',
    animatedSprite:
      d.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null,
    types: d.types.map((t: { type: { name: string } }) => t.type.name),
  }
}

// ── Request helper ───────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

async function handleRes<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = Object.values(data).flat().join(' · ')
    throw new Error(msg || `Request failed (${res.status})`)
  }
  // 204 No Content
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Teams CRUD ───────────────────────────────────────────────────────────────

export async function getTeams(token: string): Promise<Team[]> {
  const res = await fetch(`${BASE}/teams/`, {
    headers: authHeaders(token),
  })
  const data = await handleRes<TeamsListResponse>(res)
  return data.results
}

export async function createTeam(token: string, name: string): Promise<Team> {
  const res = await fetch(`${BASE}/teams/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name, favorite: false }),
  })
  return handleRes<Team>(res)
}

export async function updateTeam(
  token: string,
  id: number,
  patch: Partial<Pick<Team, 'name' | 'favorite'>>,
): Promise<Team> {
  const res = await fetch(`${BASE}/teams/${id}/`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
  return handleRes<Team>(res)
}

export async function deleteTeam(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/teams/${id}/`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleRes<void>(res)
}

// ── Members CRUD ─────────────────────────────────────────────────────────────

export async function addMember(
  token: string,
  teamId: number,
  pokemon: number,
  position: number,
  nickname: string,
): Promise<TeamMember> {
  const res = await fetch(`${BASE}/team-members/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ team: teamId, pokemon, position, nickname }),
  })
  return handleRes<TeamMember>(res)
}

export async function updateMember(
  token: string,
  _teamId: number,
  memberId: number,
  patch: Partial<Pick<TeamMember, 'nickname' | 'position'>>,
): Promise<TeamMember> {
  const res = await fetch(`${BASE}/team-members/${memberId}/`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
  return handleRes<TeamMember>(res)
}

export async function removeMember(
  token: string,
  _teamId: number,
  memberId: number,
): Promise<void> {
  const res = await fetch(`${BASE}/team-members/${memberId}/`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleRes<void>(res)
}
