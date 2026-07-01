'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal'
import { PokemonSprite, fetchPokemonSprite } from '@/lib/teams-api'
import { TYPE_COLORS } from '@/lib/type-colors'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const POKE_API = 'https://pokeapi.co/api/v2'
const DEBOUNCE = 300

// Search all pokemon names (fetched once, cached)
let allNamesCache: string[] | null = null
async function getAllNames(): Promise<string[]> {
  if (allNamesCache) return allNamesCache
  const res = await fetch(`${POKE_API}/pokemon?limit=1500`)
  const d = await res.json()
  allNamesCache = d.results.map((r: { name: string }) => r.name)
  return allNamesCache!
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

type PickResult = { pokemon: PokemonSprite; nickname: string }

type Props = {
  open:     boolean
  position: number
  onClose:  () => void
  onPick:   (result: PickResult) => Promise<void>
}

export default function PokemonPicker({ open, position, onClose, onPick }: Props) {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState<PokemonSprite[]>([])
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState<PokemonSprite | null>(null)
  const [nickname, setNickname] = useState('')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery(''); setResults([]); setSelected(null)
      setNickname(''); setError(''); setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim().toLowerCase()
    if (!trimmed) { setResults([]); return }

    setLoading(true)
    setError('')
    try {
      // Try direct ID lookup first (#306, 306)
      const numericId = trimmed.startsWith('#') ? trimmed.slice(1) : (isNaN(Number(trimmed)) ? null : trimmed)
      if (numericId) {
        const s = await fetchPokemonSprite(Number(numericId))
        setResults([s])
        setLoading(false)
        return
      }

      // Name search: filter the full list, fetch first 12 matches
      const names = await getAllNames()
      const matches = names.filter(n => n.includes(trimmed)).slice(0, 12)
      const sprites = await Promise.all(matches.map(n =>
        fetchPokemonSprite(n as unknown as number).catch(() => null)
      ))
      setResults(sprites.filter(Boolean) as PokemonSprite[])
    } catch {
      setError('Pokémon not found')
      setResults([])
    }
    setLoading(false)
  }, [])

  const handleQuery = (v: string) => {
    setQuery(v)
    setSelected(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), DEBOUNCE)
  }

  const handleSelect = (s: PokemonSprite) => {
    setSelected(s)
    setNickname(s.name.replace(/-/g, ' '))
  }

  const handleConfirm = async () => {
    if (!selected) return
    setSaving(true)
    setError('')
    try {
      await onPick({ pokemon: selected, nickname: nickname.trim() || selected.name })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokémon')
    }
    setSaving(false)
  }

  const primary = selected?.types[0]
  const ts = primary ? (TYPE_COLORS[primary] ?? TYPE_COLORS.normal) : null

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box
        sx={{
          width: '100%', maxWidth: 560,
          background: 'linear-gradient(170deg, #1e0000 0%, #0d0000 100%)',
          border: '2px solid #3d0000',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(204,0,0,0.15), 0 24px 60px rgba(0,0,0,0.95)',
          outline: 'none',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top strip */}
        <Box sx={{ height: '3px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', flexShrink: 0 }} />

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 2, flexShrink: 0 }}>
          <Box>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#a06060', letterSpacing: '0.2em', mb: 0.5 }}>
              SLOT {position}
            </Typography>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '14px', color: '#f8d030', letterSpacing: '0.08em', textShadow: '0 0 12px rgba(248,208,48,0.5)' }}>
              ADD POKÉMON
            </Typography>
          </Box>
          <Box onClick={onClose} sx={{ color: '#5a3030', cursor: 'pointer', lineHeight: 0, '&:hover': { color: '#f0c0c0' }, transition: 'color 0.15s' }}>
            <CloseIcon />
          </Box>
        </Box>

        {/* Search input */}
        <Box sx={{ px: 3, pb: 2, flexShrink: 0 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            background: '#080000', border: '1.5px solid #3d0000', borderRadius: '6px', px: 2, height: 50,
            '&:focus-within': { borderColor: '#cc0000', boxShadow: '0 0 12px rgba(204,0,0,0.2)' },
            transition: 'border-color 0.2s',
          }}>
            <Box sx={{ color: loading ? '#cc0000' : '#5a3030', flexShrink: 0, lineHeight: 0 }}>
              {loading ? <CircularProgress size={16} sx={{ color: '#cc0000' }} /> : <SearchIcon />}
            </Box>
            <InputBase
              inputRef={inputRef}
              value={query}
              onChange={e => handleQuery(e.target.value)}
              placeholder="Search by name or #id…"
              sx={{
                flex: 1, fontFamily: MONO, fontSize: '14px', color: '#f0f0f0',
                '& input::placeholder': { color: '#3d1010', opacity: 1 },
                '& input': { p: 0 },
              }}
            />
          </Box>
        </Box>

        {/* Results grid — scrollable */}
        {!selected && (
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 2, minHeight: 0 }}>
            {error && (
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#cc0000', textAlign: 'center', py: 3 }}>
                {error}
              </Typography>
            )}
            {!loading && results.length === 0 && query && !error && (
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#3d1010', textAlign: 'center', py: 3 }}>
                NO RESULTS
              </Typography>
            )}
            {!query && !loading && (
              <Typography sx={{ fontFamily: MONO, fontSize: '12px', color: '#3d1010', textAlign: 'center', py: 4 }}>
                Type a Pokémon name or Pokédex number to search
              </Typography>
            )}
            {results.length > 0 && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, '@media (max-width:480px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
                {results.map(s => {
                  const pt = s.types[0]; const ptc = pt ? (TYPE_COLORS[pt] ?? TYPE_COLORS.normal) : null
                  return (
                    <Box
                      key={s.id}
                      onClick={() => handleSelect(s)}
                      sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                        background: ptc ? `linear-gradient(160deg, #140000, ${ptc.bg})` : '#120000',
                        border: `1.5px solid ${ptc ? ptc.border + '44' : '#2a0000'}`,
                        borderRadius: '6px', p: 1.5, cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': {
                          border: `1.5px solid ${ptc ? ptc.border : '#cc0000'}`,
                          transform: 'translateY(-2px)',
                          boxShadow: ptc ? `0 4px 14px ${ptc.border}33` : '0 4px 14px rgba(204,0,0,0.2)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={s.animatedSprite ?? s.sprite}
                        alt={s.name}
                        loading="lazy"
                        sx={{ width: 56, height: 56, imageRendering: 'pixelated' }}
                      />
                      <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: '#f0c0c0', textTransform: 'capitalize', textAlign: 'center', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                        {s.name}
                      </Typography>
                      <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: '#3d1010' }}>
                        #{String(s.id).padStart(3, '0')}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Selected: nickname + confirm */}
        {selected && ts && (
          <Box sx={{ px: 3, pb: 3, flexShrink: 0 }}>
            {/* Selected preview */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: `linear-gradient(160deg, #140000, ${ts.bg})`,
              border: `1.5px solid ${ts.border}55`,
              borderRadius: '8px', p: 2, mb: 2,
            }}>
              <Box
                component="img"
                src={selected.animatedSprite ?? selected.sprite}
                alt={selected.name}
                sx={{ width: 72, height: 72, imageRendering: 'pixelated', filter: `drop-shadow(0 2px 8px ${ts.border}88)` }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#f8d030', textTransform: 'capitalize', letterSpacing: '0.08em', mb: 0.5 }}>
                  {selected.name}
                </Typography>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#5a3030', mb: 1 }}>
                  #{String(selected.id).padStart(3, '0')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {selected.types.map(t => {
                    const tc = TYPE_COLORS[t] ?? TYPE_COLORS.normal
                    return (
                      <Box key={t} sx={{ background: tc.bg, border: `1px solid ${tc.border}`, borderRadius: '2px', px: '5px', py: '1px' }}>
                        <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: tc.text }}>{t.toUpperCase()}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box onClick={() => setSelected(null)} sx={{ color: '#5a3030', cursor: 'pointer', lineHeight: 0, alignSelf: 'flex-start', '&:hover': { color: '#f0c0c0' } }}>
                <CloseIcon />
              </Box>
            </Box>

            {/* Nickname */}
            <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.15em', mb: 1 }}>
              NICKNAME
            </Typography>
            <InputBase
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder={selected.name}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
              sx={{
                width: '100%', fontFamily: MONO, fontSize: '15px', color: '#f0f0f0',
                background: '#080000', border: '1.5px solid #3d0000', borderRadius: '5px',
                px: 2, height: 48, mb: 2,
                '&:focus-within': { borderColor: '#cc0000', boxShadow: '0 0 10px rgba(204,0,0,0.2)' },
                '& input::placeholder': { color: '#3d1010', opacity: 1 },
                '& input': { p: 0 },
                transition: 'border-color 0.2s',
              }}
            />

            {error && (
              <Typography sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#cc0000', mb: 1.5, letterSpacing: '0.06em' }}>
                ✕ {error}
              </Typography>
            )}

            {/* Confirm button */}
            <Box
              component="button"
              onClick={handleConfirm}
              disabled={saving}
              sx={{
                width: '100%', height: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                fontFamily: PIXEL, fontSize: '12px', letterSpacing: '0.08em',
                color: '#1a0000', cursor: saving ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)',
                border: '2px solid #a07000',
                borderRadius: '5px',
                boxShadow: '0 0 16px rgba(248,208,48,0.35)',
                transition: 'all 0.15s',
                '&:hover:not(:disabled)': { boxShadow: '0 0 28px rgba(248,208,48,0.6)', transform: 'translateY(-1px)' },
              }}
            >
              {saving ? <CircularProgress size={16} sx={{ color: '#5a4000' }} /> : null}
              {saving ? 'ADDING…' : 'ADD TO TEAM'}
            </Box>
          </Box>
        )}

        {/* Bottom strip */}
        <Box sx={{ height: '2px', background: 'linear-gradient(90deg, transparent, #3d0000, transparent)', flexShrink: 0 }} />
      </Box>
    </Modal>
  )
}
