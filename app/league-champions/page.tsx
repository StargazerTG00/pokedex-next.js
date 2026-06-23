import Image from 'next/image'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import ChampionCard, { ChampionData } from '@/components/champion-card'
import { TYPE_COLORS } from '@/lib/type-colors'

const CHAMPIONS = [
  'aggron',
  'lapras',
  'sceptile',
  'haunter',
  'swampert',
  'metagross',
]

const HONOR_MENTIONS = [
  'milotic',
  'hariyama',
  'arcanine',
  'dragonite',
  'gardevoir',
  'tyranitar',
]

type HonorData = {
  id: number
  name: string
  artworkUrl: string
  animatedSprite: string | null
  types: string[]
}

async function fetchChampion(name: string, rank: number): Promise<ChampionData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${name}`)
  const data = await res.json()

  return {
    id: data.id,
    name: data.name,
    rank,
    artworkUrl:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default,
    animatedSprite:
      data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null,
    cryUrl: data.cries?.latest ?? null,
    legacyCryUrl: data.cries?.legacy ?? null,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    stats: data.stats,
    height: data.height,
    weight: data.weight,
  }
}

async function fetchHonor(name: string): Promise<HonorData> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${name}`)
  const data = await res.json()
  return {
    id: data.id,
    name: data.name,
    artworkUrl:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default,
    animatedSprite:
      data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
  }
}

export default async function LeagueChampionsPage() {
  const [champions, honors] = await Promise.all([
    Promise.all(CHAMPIONS.map((name, i) => fetchChampion(name, i + 1))),
    Promise.all(HONOR_MENTIONS.map(fetchHonor)),
  ])

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 50%, #000000 100%)',
        px: { xs: 2, sm: 4 },
        py: 6,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        {/* Trophy icon */}
        <Typography sx={{ fontSize: '40px', lineHeight: 1, mb: 2 }}>🏆</Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: { xs: '12px', sm: '16px', md: '20px' },
            color: '#f8d030',
            textShadow: '0 0 20px rgba(248,208,48,0.8), 0 0 40px rgba(248,208,48,0.4)',
            letterSpacing: '0.12em',
            mb: 1.5,
          }}
        >
          LEAGUE CHAMPIONS
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: { xs: '6px', sm: '8px' },
            color: '#a06060',
            letterSpacing: '0.2em',
            mb: 3,
          }}
        >
          HALL OF FAME
        </Typography>

        {/* Decorative separator */}
        <Box
          sx={{
            mx: 'auto',
            maxWidth: '400px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)',
            boxShadow: '0 0 12px rgba(248,208,48,0.4)',
          }}
        />
      </Box>

      {/* Main team grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 4,
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {champions.map((champion) => (
          <ChampionCard key={champion.id} data={champion} />
        ))}
      </Box>

      {/* ── Honor Mentions ── */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', mt: 10 }}>
        {/* Section header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: '9px',
              color: '#cc0000',
              letterSpacing: '0.3em',
              mb: 1,
            }}
          >
            ★ HONORABLE MENTIONS ★
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: { xs: '10px', sm: '14px' },
              color: '#c8a060',
              textShadow: '0 0 14px rgba(200,160,96,0.5)',
              letterSpacing: '0.1em',
              mb: 2,
            }}
          >
            HALL OF HONOR
          </Typography>
          <Box
            sx={{
              mx: 'auto',
              maxWidth: 360,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #cc000066, #c8a06066, #cc000066, transparent)',
            }}
          />
        </Box>

        {/* Honor cards grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {honors.map((h) => {
            const primaryType = h.types[0]
            const ts = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal
            return (
              <Link key={h.id} href={`/search/${h.id}`} style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: `linear-gradient(170deg, #140000 0%, ${ts.bg} 100%)`,
                    border: `1.5px solid ${ts.border}55`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
                    '&:hover': {
                      border: `1.5px solid ${ts.border}`,
                      boxShadow: `0 0 24px ${ts.border}44, 0 8px 28px rgba(0,0,0,0.8)`,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Top accent */}
                  <Box sx={{ width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${ts.border}88, transparent)` }} />

                  {/* Sprite */}
                  <Box
                    sx={{
                      pt: 2, pb: 0.5,
                      background: `radial-gradient(ellipse at 50% 60%, ${ts.border}18 0%, transparent 70%)`,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {h.animatedSprite ? (
                      <Box
                        component="img"
                        src={h.animatedSprite}
                        alt={h.name}
                        sx={{ width: 96, height: 96, imageRendering: 'pixelated', filter: `drop-shadow(0 4px 12px ${ts.border}cc)` }}
                      />
                    ) : (
                      <Image
                        src={h.artworkUrl}
                        alt={h.name}
                        width={96}
                        height={96}
                        style={{ imageRendering: 'auto', filter: `drop-shadow(0 4px 12px ${ts.border}99)` }}
                      />
                    )}
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-press-start), monospace',
                      fontSize: '7.5px',
                      color: '#f0d080',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      textAlign: 'center',
                      px: 1,
                      mb: 1,
                    }}
                  >
                    {h.name}
                  </Typography>

                  {/* Type chips */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap', px: 1, pb: 1.5 }}>
                    {h.types.map((t) => {
                      const tc = TYPE_COLORS[t] ?? TYPE_COLORS.normal
                      return (
                        <Chip
                          key={t}
                          label={t.toUpperCase()}
                          size="small"
                          sx={{
                            height: '15px',
                            fontFamily: 'var(--font-press-start), monospace',
                            fontSize: '7px',
                            letterSpacing: '0.05em',
                            background: tc.bg,
                            color: tc.text,
                            border: `1px solid ${tc.border}`,
                            borderRadius: '2px',
                            '& .MuiChip-label': { px: '5px' },
                          }}
                        />
                      )
                    })}
                  </Box>

                  {/* Bottom accent */}
                  <Box sx={{ width: '100%', height: '2px', background: `linear-gradient(90deg, transparent, ${ts.border}44, transparent)` }} />
                </Box>
              </Link>
            )
          })}
        </Box>
      </Box>

      {/* Meme section */}
      <Box
        sx={{
          maxWidth: '900px',
          mx: 'auto',
          mt: 10,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, sm: 6 },
        }}
      >
        <Box sx={{ flexShrink: 0, lineHeight: 0, filter: 'drop-shadow(0 0 28px rgba(204,0,0,0.7))' }}>
          <Image
            src="/aggron-meme.gif"
            alt="Aggron meme"
            width={320}
            height={320}
            unoptimized
            style={{ imageRendering: 'pixelated' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: { xs: '9px', sm: '11px' },
              color: '#f8d030',
              textShadow: '0 0 10px rgba(248,208,48,0.6)',
              letterSpacing: '0.08em',
              lineHeight: 2,
            }}
          >
            THIS IS MY OVERALL<br />FAVORITE POKEMON TEAM.
          </Typography>
          <Box sx={{ height: '2px', background: 'linear-gradient(90deg, #cc0000, transparent)' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: { xs: '8px', sm: '9px' },
              color: '#f0c0c0',
              letterSpacing: '0.06em',
              lineHeight: 2.2,
            }}
          >
            AND WITH THE BEST<br />POKEMON (NON LEGENDARY)<br />AS &quot;THE WALL&quot;...
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: { xs: '18px', sm: '24px' },
              color: '#aaaaaa',
              textShadow: '0 0 20px rgba(180,180,180,0.7), 0 0 40px rgba(150,150,150,0.3)',
              letterSpacing: '0.12em',
              lineHeight: 1,
            }}
          >
            AGGRON.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '9px', color: '#3d1010', letterSpacing: '0.15em' }}>
          Made by: Guillermo Toloza
        </Typography>
      </Box>
    </Box>
  )
}
