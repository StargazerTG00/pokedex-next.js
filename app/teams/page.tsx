'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@/lib/auth-context'
import {
  Team, getTeams, createTeam, addMember, fetchPokemonSprite,
} from '@/lib/teams-api'
import TeamCard from '@/components/teams/team-card'
import PokemonPicker from '@/components/teams/pokemon-picker'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

// ── Auth guard splash ────────────────────────────────────────────────────────

function NotLoggedIn() {
  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, px: 3, textAlign: 'center' }}>
      <Box sx={{ color: '#3d1010' }}><ShieldIcon /></Box>
      <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '11px', sm: '14px' }, color: '#f8d030', textShadow: '0 0 14px rgba(248,208,48,0.5)', letterSpacing: '0.1em' }}>
        TRAINER LOGIN REQUIRED
      </Typography>
      <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#a06060', maxWidth: 360, lineHeight: 1.8 }}>
        You need to be logged in to manage your Pokémon teams.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Box sx={{ fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.08em', px: 3, py: '10px', borderRadius: '4px', color: '#1a0000', background: 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)', border: '2px solid #a07000', boxShadow: '0 0 16px rgba(248,208,48,0.4)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            LOGIN
          </Box>
        </Link>
        <Link href="/register" style={{ textDecoration: 'none' }}>
          <Box sx={{ fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.08em', px: 3, py: '10px', borderRadius: '4px', color: '#f0c0c0', border: '2px solid #7a0000', boxShadow: '0 3px 0 #0d0000', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            REGISTER
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Typography sx={{ fontSize: '48px', lineHeight: 1 }}>⚔️</Typography>
      <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '10px', sm: '13px' }, color: '#f8d030', letterSpacing: '0.1em', textShadow: '0 0 12px rgba(248,208,48,0.4)' }}>
        NO TEAMS YET
      </Typography>
      <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#a06060', maxWidth: 360, lineHeight: 1.8 }}>
        Build your first team and fill it with up to 6 Pokémon.
      </Typography>
      <Box
        onClick={onCreate}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.08em',
          px: 3, py: '11px', borderRadius: '4px', cursor: 'pointer',
          color: '#1a0000',
          background: 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)',
          border: '2px solid #a07000',
          boxShadow: '0 0 16px rgba(248,208,48,0.4)',
          transition: 'all 0.15s',
          '&:hover': { boxShadow: '0 0 28px rgba(248,208,48,0.65)', transform: 'translateY(-1px)' },
        }}
      >
        <PlusIcon />
        NEW TEAM
      </Box>
    </Box>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type PickerState = { teamId: number; position: number } | null

export default function TeamsPage() {
  const router = useRouter()
  const { token, username, hydrated } = useAuth()

  const [teams,       setTeams]       = useState<Team[]>([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [pageError,   setPageError]   = useState('')
  const [creating,    setCreating]    = useState(false)
  const [picker,      setPicker]      = useState<PickerState>(null)

  // ── Load teams ─────────────────────────────────────────────────────────────
  const loadTeams = useCallback(async (t: string) => {
    setLoadingPage(true)
    setPageError('')
    try {
      const data = await getTeams(t)
      // Sort: favorites first, then by creation date desc
      setTeams(data.sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }))
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Failed to load teams')
    }
    setLoadingPage(false)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!token) { setLoadingPage(false); return }
    loadTeams(token)
  }, [hydrated, token, loadTeams])

  // ── Create team ────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!token) return
    setCreating(true)
    try {
      const name = `Team ${teams.length + 1}`
      const team = await createTeam(token, name)
      setTeams(prev => [team, ...prev])
    } catch { /* noop */ }
    setCreating(false)
  }

  // ── Team / member updates (optimistic) ────────────────────────────────────
  const handleTeamUpdated = useCallback((updated: Team) => {
    setTeams(prev => {
      const next = prev.map(t => t.id === updated.id ? updated : t)
      return next.sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    })
  }, [])

  const handleTeamDeleted = useCallback((id: number) => {
    setTeams(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Pokemon picker ────────────────────────────────────────────────────────
  const openPicker = useCallback((teamId: number, position: number) => {
    setPicker({ teamId, position })
  }, [])

  const handlePick = useCallback(async ({ pokemon, nickname }: { pokemon: { id: number }; nickname: string }) => {
    if (!token || !picker) return
    const member = await addMember(token, picker.teamId, pokemon.id, picker.position, nickname)
    // Fetch full sprite info for the new member and inject into team
    const sprite = await fetchPokemonSprite(member.pokemon)
    void sprite // sprite is cached for the slot component to pick up
    setTeams(prev => prev.map(t =>
      t.id === picker.teamId
        ? { ...t, members: [...t.members.filter(m => m.position !== picker.position), member] }
        : t
    ))
  }, [token, picker])

  // ── Redirect if logged out after page loaded ──────────────────────────────
  useEffect(() => {
    if (hydrated && !token) router.prefetch('/login')
  }, [hydrated, token, router])

  // ── Render ────────────────────────────────────────────────────────────────

  // Loading skeleton while localStorage hydrates
  if (!hydrated) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#cc0000' }} />
      </Box>
    )
  }

  if (!token) return (
    <Box component="main" sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 50%, #000000 100%)' }}>
      <NotLoggedIn />
    </Box>
  )

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 50%, #000000 100%)',
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
      }}
    >
      {/* Page header */}
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.25em', mb: 1 }}>
              TRAINER
            </Typography>
            <Typography sx={{
              fontFamily: PIXEL,
              fontSize: { xs: '14px', sm: '20px' },
              color: '#f8d030',
              textShadow: '0 0 20px rgba(248,208,48,0.7)',
              letterSpacing: '0.1em',
              mb: 0.5,
            }}>
              MY TEAMS
            </Typography>
            <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#a06060' }}>
              {username && <span style={{ color: '#f0c0c0' }}>{username}</span>}
              {teams.length > 0 && <span> · {teams.length} team{teams.length !== 1 ? 's' : ''}</span>}
            </Typography>
          </Box>

          {/* New team button */}
          <Box
            onClick={handleCreate}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.25,
              fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.08em',
              px: 2.5, py: '10px', borderRadius: '4px', cursor: creating ? 'not-allowed' : 'pointer',
              color: '#1a0000',
              background: 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)',
              border: '2px solid #a07000',
              boxShadow: '0 0 14px rgba(248,208,48,0.35)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              '&:hover': { boxShadow: '0 0 24px rgba(248,208,48,0.6)', transform: 'translateY(-1px)' },
            }}
          >
            {creating
              ? <CircularProgress size={14} sx={{ color: '#5a4000' }} />
              : <PlusIcon />}
            NEW TEAM
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '2px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', boxShadow: '0 0 8px rgba(248,208,48,0.25)', mb: 5 }} />

        {/* Body */}
        {loadingPage ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#cc0000' }} />
          </Box>
        ) : pageError ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '10px', color: '#cc0000', mb: 2 }}>
              ✕ {pageError}
            </Typography>
            <Box onClick={() => loadTeams(token)} sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', cursor: 'pointer', '&:hover': { color: '#f0c0c0' } }}>
              RETRY
            </Box>
          </Box>
        ) : teams.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                token={token}
                onPickPokemon={openPicker}
                onTeamUpdated={handleTeamUpdated}
                onTeamDeleted={handleTeamDeleted}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Pokemon picker modal */}
      <PokemonPicker
        open={picker !== null}
        position={picker?.position ?? 1}
        onClose={() => setPicker(null)}
        onPick={handlePick}
      />
    </Box>
  )
}
