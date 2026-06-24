'use client'

import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TYPE_COLORS } from '@/lib/type-colors'

export { TYPE_COLORS }

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'

export type PokemonSummary = {
  id: number
  name: string
  types: string[]
  sprite: string
  animatedSprite: string | null
}

export default function PokemonCard({ pokemon, priority = false }: { pokemon: PokemonSummary; priority?: boolean }) {
  const primary = pokemon.types[0]
  const ts = TYPE_COLORS[primary] ?? TYPE_COLORS.normal

  return (
    <Link href={`/search/${pokemon.id}`} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: `linear-gradient(160deg, #1a0000 0%, #0d0000 60%, ${ts.bg} 100%)`,
          border: `1.5px solid ${ts.border}44`,
          borderRadius: '6px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: `0 4px 16px rgba(0,0,0,0.6)`,
          '&:hover': {
            border: `1.5px solid ${ts.border}`,
            transform: 'translateY(-4px)',
            boxShadow: `0 0 20px ${ts.glow}, 0 12px 32px rgba(0,0,0,0.8)`,
          },
        }}
      >
        {/* top accent line */}
        <Box sx={{ height: '2px', width: '100%', background: `linear-gradient(90deg, transparent, ${ts.border}88, transparent)` }} />

        {/* ID */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: ts.border, opacity: 0.5 }}>
            #{String(pokemon.id).padStart(3, '0')}
          </Typography>
        </Box>

        {/* Sprite */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pt: 3, pb: 0.5, width: '100%',
            background: `radial-gradient(ellipse at 50% 60%, ${ts.border}15 0%, transparent 70%)`,
          }}
        >
          {pokemon.animatedSprite ? (
            // GIFs must bypass the Next.js optimizer — it would break the animation
            <Box
              component="img"
              src={pokemon.animatedSprite}
              alt={pokemon.name}
              loading={priority ? 'eager' : 'lazy'}
              sx={{
                width: 80,
                height: 80,
                imageRendering: 'pixelated',
                filter: `drop-shadow(0 2px 8px ${ts.border}88)`,
              }}
            />
          ) : (
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              width={88}
              height={88}
              priority={priority}
              style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 2px 8px ${ts.border}88)` }}
            />
          )}
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.06em',
            color: '#f0e0e0', textTransform: 'capitalize', mt: 0.75, mb: 0.5,
            textAlign: 'center', px: 1,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pokemon.name}
        </Typography>

        {/* Types */}
        <Box sx={{ display: 'flex', gap: 0.5, pb: 1.5, flexWrap: 'wrap', justifyContent: 'center', px: 1 }}>
          {pokemon.types.map((t) => {
            const tc = TYPE_COLORS[t] ?? TYPE_COLORS.normal
            return (
              <Box key={t} sx={{ background: tc.bg, border: `1px solid ${tc.border}`, borderRadius: '2px', px: '5px', py: '1px' }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: tc.text, letterSpacing: '0.06em' }}>
                  {t.toUpperCase()}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Link>
  )
}
