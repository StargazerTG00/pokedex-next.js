'use client'

import { useState, useCallback, useTransition, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const DEBOUNCE_MS = 380
const STORAGE_KEY = 'pokedex_search'

const TYPES = [
  'normal','fire','water','grass','electric','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy',
]

const REGIONS = [
  { label: 'ALL REGIONS', value: '' },
  { label: 'KANTO',  value: 'kanto'  },
  { label: 'JOHTO',  value: 'johto'  },
  { label: 'HOENN',  value: 'hoenn'  },
  { label: 'SINNOH', value: 'sinnoh' },
  { label: 'UNOVA',  value: 'unova'  },
  { label: 'KALOS',  value: 'kalos'  },
  { label: 'ALOLA',  value: 'alola'  },
  { label: 'GALAR',  value: 'galar'  },
  { label: 'PALDEA', value: 'paldea' },
]

const TYPE_COLORS: Record<string, string> = {
  normal:'#888860', fire:'#cc3300', water:'#0077dd', grass:'#009900',
  electric:'#ddbb00', ice:'#44bbdd', fighting:'#aa0000', poison:'#992299',
  ground:'#aa7700', flying:'#6688bb', psychic:'#dd0077', bug:'#559900',
  rock:'#998855', ghost:'#7744aa', dragon:'#3355bb', dark:'#555555',
  steel:'#7788aa', fairy:'#dd55dd',
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function SearchControls() {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()
  const [pending, startTransition] = useTransition()

  const [query,  setQuery]  = useState(params.get('q')      ?? '')
  const [type,   setType]   = useState(params.get('type')   ?? '')
  const [region, setRegion] = useState(params.get('region') ?? '')

  const [debouncing, setDebouncing] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const push = useCallback((q: string, t: string, r: string, page?: string) => {
    const sp = new URLSearchParams()
    if (q)    sp.set('q',      q)
    if (t)    sp.set('type',   t)
    if (r)    sp.set('region', r)
    if (page) sp.set('page',   page)
    const qs = sp.toString()
    if (typeof window !== 'undefined') {
      if (qs) sessionStorage.setItem(STORAGE_KEY, qs)
      else    sessionStorage.removeItem(STORAGE_KEY)
    }
    startTransition(() => router.push(pathname + (qs ? `?${qs}` : '')))
  }, [router, pathname])

  useEffect(() => {
    const hasUrlParams = params.get('q') || params.get('type') || params.get('region') || params.get('page')
    if (hasUrlParams) return
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const sp = new URLSearchParams(saved)
      const q = sp.get('q') ?? ''
      const t = sp.get('type') ?? ''
      const r = sp.get('region') ?? ''
      const pg = sp.get('page') ?? ''
      setQuery(q); setType(t); setRegion(r)
      startTransition(() => router.replace(pathname + `?${saved}`))
      void pg
    } catch { /* sessionStorage unavailable */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuery = (v: string) => {
    setQuery(v)
    setDebouncing(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncing(false)
      push(v, type, region)
    }, DEBOUNCE_MS)
  }

  const handleType = (v: string) => { setType(v); push(query, v, region) }
  const handleRegion = (v: string) => { setRegion(v); push(query, type, v) }

  const clearAll = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setDebouncing(false)
    setQuery(''); setType(''); setRegion('')
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY)
    startTransition(() => router.push(pathname))
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const hasFilters = query || type || region
  const isLoading  = debouncing || pending

  const selectSx = {
    fontFamily: PIXEL,
    fontSize: { xs: '10px', sm: '11px' },
    color: '#f0c0c0',
    background: '#120000',
    border: '1.5px solid #3d0000',
    borderRadius: '4px',
    // On xs take full width; on sm use fixed min-width
    width: { xs: '100%', sm: 'auto' },
    minWidth: { xs: 0, sm: 150 },
    height: 44,
    '& .MuiSelect-select': { py: '0px', px: '14px', display: 'flex', alignItems: 'center' },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSvgIcon-root': { color: '#a06060' },
    '&:hover': { borderColor: '#cc0000' },
    '&.Mui-focused': { borderColor: '#cc0000', boxShadow: '0 0 8px rgba(204,0,0,0.3)' },
  }

  const menuSx = {
    slotProps: {
      paper: {
        sx: {
          background: '#120000',
          border: '1.5px solid #3d0000',
          borderRadius: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          '& .MuiMenuItem-root': {
            fontFamily: PIXEL, fontSize: '11px', color: '#f0c0c0',
            py: '10px',
            '&:hover': { background: '#2a0000' },
            '&.Mui-selected': { background: '#3d0000', color: '#f8d030' },
          },
        },
      },
    },
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Search input */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: 1.5,
          background: '#120000', border: '1.5px solid #3d0000',
          borderRadius: '6px', px: 2, height: 58,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:focus-within': { borderColor: '#cc0000', boxShadow: '0 0 16px rgba(204,0,0,0.2)' },
        }}
      >
        <Box sx={{ color: '#a06060', display: 'flex', flexShrink: 0, transition: 'color 0.2s', ...(isLoading && { color: '#cc0000' }) }}>
          {isLoading
            ? <CircularProgress size={18} sx={{ color: '#cc0000' }} />
            : <SearchIcon />
          }
        </Box>

        <InputBase
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (debounceRef.current) clearTimeout(debounceRef.current)
              setDebouncing(false)
              push(query, type, region)
            }
          }}
          placeholder="Search by name or #id…"
          sx={{
            flex: 1,
            fontFamily: MONO,
            fontSize: { xs: '13px', sm: '15px' },
            color: '#f0f0f0',
            '& input::placeholder': { color: '#5a3030', opacity: 1 },
            '& input': { p: 0 },
          }}
        />

        {debouncing && (
          <Box sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '2px',
            background: '#1a0000',
            borderRadius: '0 0 6px 6px',
            overflow: 'hidden',
          }}>
            <Box sx={{
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #cc0000, transparent)',
              animation: 'scan 0.38s linear forwards',
              '@keyframes scan': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } },
            }} />
          </Box>
        )}

        {hasFilters && (
          <IconButton size="small" onClick={clearAll}
            sx={{ color: '#5a3030', p: '4px', '&:hover': { color: '#cc0000' }, flexShrink: 0 }}>
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* Filters row — stacks on mobile */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto 1fr 1fr' },
        gap: 1.5,
        alignItems: 'center',
      }}>
        {/* "FILTER:" label — spans both columns on xs, sits in first column on sm+ */}
        <Typography sx={{
          fontFamily: PIXEL,
          fontSize: '11px',
          color: '#a06060',
          letterSpacing: '0.15em',
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
        }}>
          FILTER:
        </Typography>

        {/* Type filter */}
        <Select value={type} onChange={(e) => handleType(e.target.value)} displayEmpty sx={selectSx} MenuProps={menuSx}>
          <MenuItem value=""><span style={{ color: '#5a3030' }}>ALL TYPES</span></MenuItem>
          {TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: TYPE_COLORS[t] ?? '#888', flexShrink: 0 }} />
                {t.toUpperCase()}
              </Box>
            </MenuItem>
          ))}
        </Select>

        {/* Region filter */}
        <Select value={region} onChange={(e) => handleRegion(e.target.value)} displayEmpty sx={selectSx} MenuProps={menuSx}>
          {REGIONS.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {value === '' ? <span style={{ color: '#5a3030' }}>{label}</span> : label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Active filter chips */}
      {(type || region) && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {type && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, background: `${TYPE_COLORS[type]}22`, border: `1px solid ${TYPE_COLORS[type]}`, borderRadius: '3px', px: 1.25, py: '4px' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_COLORS[type] }} />
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: TYPE_COLORS[type] }}>{type.toUpperCase()}</Typography>
              <Box component="button" onClick={() => handleType('')} sx={{ background: 'none', border: 'none', cursor: 'pointer', color: TYPE_COLORS[type], display: 'flex', p: 0, ml: 0.5, opacity: 0.7, '&:hover': { opacity: 1 } }}>
                <ClearIcon />
              </Box>
            </Box>
          )}
          {region && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, background: '#f8d03022', border: '1px solid #f8d030', borderRadius: '3px', px: 1.25, py: '4px' }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#f8d030' }}>{region.toUpperCase()}</Typography>
              <Box component="button" onClick={() => handleRegion('')} sx={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f8d030', display: 'flex', p: 0, ml: 0.5, opacity: 0.7, '&:hover': { opacity: 1 } }}>
                <ClearIcon />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
