import Link from 'next/link'
import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SearchControls from '@/components/search-controls'
import PokemonCard, { PokemonSummary } from '@/components/pokemon-card'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const PAGE_SIZE = 40

const REGION_GEN: Record<string, number> = {
  kanto: 1, johto: 2, hoenn: 3, sinnoh: 4,
  unova: 5, kalos: 6, alola: 7, galar: 8, paldea: 9,
}

// ── Data fetchers ────────────────────────────────────────────────────────────

async function enrich(name: string): Promise<PokemonSummary | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const d = await res.json()
    return {
      id: d.id,
      name: d.name,
      types: d.types.map((t: { type: { name: string } }) => t.type.name),
      sprite: d.sprites.front_default ?? '',
      animatedSprite:
        d.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null,
    }
  } catch {
    return null
  }
}

async function enrichPage(names: string[]): Promise<PokemonSummary[]> {
  const results = await Promise.all(names.map(enrich))
  return results.filter(Boolean) as PokemonSummary[]
}

async function fetchTypeNames(type: string): Promise<string[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.pokemon.map((e: { pokemon: { name: string } }) => e.pokemon.name)
}

async function fetchRegionNames(region: string): Promise<string[]> {
  const gen = REGION_GEN[region]
  if (!gen) return []
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.pokemon_species.map((s: { name: string }) => s.name)
}

// ── Pagination helpers ───────────────────────────────────────────────────────

function buildPageHref(
  params: { q?: string; type?: string; region?: string },
  page: number,
): string {
  const sp = new URLSearchParams()
  if (params.q)      sp.set('q',      params.q)
  if (params.type)   sp.set('type',   params.type)
  if (params.region) sp.set('region', params.region)
  if (page > 1)      sp.set('page',   String(page))
  const qs = sp.toString()
  return '/search' + (qs ? `?${qs}` : '')
}

function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set: (number | null)[] = [1]
  if (current > 3) set.push(null)
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    set.push(p)
  }
  if (current < total - 2) set.push(null)
  set.push(total)
  return set
}

function PaginationBar({
  page, totalPages, params,
}: {
  page: number
  totalPages: number
  params: { q?: string; type?: string; region?: string }
}) {
  if (totalPages <= 1) return null

  const pages = buildPageList(page, totalPages)

  const btnBase = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 36, height: 36, borderRadius: '4px',
    fontFamily: PIXEL, fontSize: '9px', letterSpacing: '0.05em',
    textDecoration: 'none', transition: 'all 0.15s',
    border: '1.5px solid #3d0000',
    color: '#a06060', background: '#0d0000',
    '&:hover': { borderColor: '#cc0000', color: '#f8d030', background: '#1a0000' },
  } as const

  const activeBtnBase = {
    ...btnBase,
    border: '1.5px solid #cc0000',
    color: '#f8d030',
    background: '#1e0000',
    boxShadow: '0 0 10px rgba(204,0,0,0.3)',
    pointerEvents: 'none' as const,
  }

  const disabledBtnBase = {
    ...btnBase,
    opacity: 0.25,
    pointerEvents: 'none' as const,
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.75, mt: 5, flexWrap: 'wrap' }}>
      {/* Prev */}
      {page > 1 ? (
        <Link href={buildPageHref(params, page - 1)} style={{ textDecoration: 'none' }}>
          <Box sx={btnBase}>←</Box>
        </Link>
      ) : (
        <Box sx={disabledBtnBase}>←</Box>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === null ? (
          <Typography key={`ellipsis-${i}`} sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#3d1010', px: 0.5 }}>
            …
          </Typography>
        ) : p === page ? (
          <Box key={p} sx={activeBtnBase}>{p}</Box>
        ) : (
          <Link key={p} href={buildPageHref(params, p)} style={{ textDecoration: 'none' }}>
            <Box sx={btnBase}>{p}</Box>
          </Link>
        )
      )}

      {/* Next */}
      {page < totalPages ? (
        <Link href={buildPageHref(params, page + 1)} style={{ textDecoration: 'none' }}>
          <Box sx={btnBase}>→</Box>
        </Link>
      ) : (
        <Box sx={disabledBtnBase}>→</Box>
      )}
    </Box>
  )
}

// ── Grid ─────────────────────────────────────────────────────────────────────

type PageProps = {
  searchParams: Promise<{ q?: string; type?: string; region?: string; page?: string }>
}

async function PokemonGrid({ searchParams }: PageProps) {
  const { q, type, region, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  let pokemon: PokemonSummary[] = []
  let total = 0
  let label = ''

  if (q) {
    // Single lookup — no pagination needed
    pokemon = await (async () => {
      const p = await enrich(q.toLowerCase().trim())
      return p ? [p] : []
    })()
    total = pokemon.length
    label = pokemon.length
      ? `RESULT FOR "${q.toUpperCase()}"`
      : `NO RESULTS FOR "${q.toUpperCase()}"`
  } else if (type && region) {
    const [typeNames, regionNames] = await Promise.all([
      fetchTypeNames(type),
      fetchRegionNames(region),
    ])
    const regionSet = new Set(regionNames)
    const allNames = typeNames.filter(n => regionSet.has(n))
    total = allNames.length
    pokemon = await enrichPage(allNames.slice(offset, offset + PAGE_SIZE))
    label = `${type.toUpperCase()} · ${region.toUpperCase()}`
  } else if (type) {
    const allNames = await fetchTypeNames(type)
    total = allNames.length
    pokemon = await enrichPage(allNames.slice(offset, offset + PAGE_SIZE))
    label = `${type.toUpperCase()} TYPE`
  } else if (region) {
    const allNames = await fetchRegionNames(region)
    total = allNames.length
    pokemon = await enrichPage(allNames.slice(offset, offset + PAGE_SIZE))
    label = `${region.toUpperCase()} REGION`
  } else {
    // Default — PokeAPI native pagination (count comes free with the response)
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
      { next: { revalidate: 86400 } },
    )
    if (res.ok) {
      const data = await res.json()
      total = data.count
      pokemon = await enrichPage(
        data.results.map((r: { name: string }) => r.name),
      )
    }
    label = 'ALL POKÉMON'
  }

  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1
  const params = { q, type, region }

  if (!pokemon.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography sx={{ fontSize: '40px', mb: 2 }}>😵</Typography>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#cc0000', mb: 1 }}>
          NOT FOUND
        </Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#a06060' }}>
          No Pokémon matched your search. Try a different name or filter.
        </Typography>
      </Box>
    )
  }

  const showing = `${offset + 1}–${Math.min(offset + pokemon.length, total)} OF ${total}`

  return (
    <>
      {/* Result header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#a06060', letterSpacing: '0.15em' }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#3d1010' }}>
          {showing}
        </Typography>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
            xl: 'repeat(6, 1fr)',
          },
          gap: 2,
        }}
      >
        {pokemon.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
      </Box>

      {/* Pagination */}
      <PaginationBar page={page} totalPages={totalPages} params={params} />
    </>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', md: 'repeat(4,1fr)', lg: 'repeat(5,1fr)', xl: 'repeat(6,1fr)' }, gap: 2 }}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Box
          key={i}
          sx={{
            background: '#120000', border: '1.5px solid #1e0000', borderRadius: '6px', height: 190,
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${(i % 6) * 0.08}s`,
            '@keyframes pulse': { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 0.65 } },
          }}
        />
      ))}
    </Box>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage({ searchParams }: PageProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 40%, #000000 100%)',
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#a06060', letterSpacing: '0.25em', mb: 1 }}>
          POKÉDEX
        </Typography>
        <Typography
          sx={{
            fontFamily: PIXEL,
            fontSize: { xs: '14px', sm: '20px' },
            color: '#f8d030',
            textShadow: '0 0 20px rgba(248,208,48,0.7)',
            letterSpacing: '0.1em',
            mb: 1,
          }}
        >
          SEARCH
        </Typography>
        <Box sx={{ mx: 'auto', maxWidth: 300, height: '2px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', boxShadow: '0 0 8px rgba(248,208,48,0.3)' }} />
      </Box>

      {/* Search controls — client island */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <SearchControls />
      </Box>

      {/* Results */}
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Suspense fallback={<GridSkeleton />}>
          <PokemonGrid searchParams={searchParams} />
        </Suspense>
      </Box>
    </Box>
  )
}
