import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #3d0000 0%, #0a0000 60%, #000000 100%)',
        px: 4,
        gap: 3,
        textAlign: 'center',
      }}
    >
      <Box component="img"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/54.gif"
        alt="confused psyduck"
        sx={{ width: 96, height: 96, imageRendering: 'pixelated', filter: 'drop-shadow(0 0 12px rgba(204,0,0,0.5))' }}
      />
      <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '12px', sm: '16px' }, color: '#cc0000', textShadow: '0 0 16px rgba(204,0,0,0.7)', letterSpacing: '0.1em' }}>
        404
      </Typography>
      <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '8px', sm: '10px' }, color: '#f8d030', letterSpacing: '0.1em' }}>
        POKÉMON NOT FOUND
      </Typography>
      <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#a06060', maxWidth: 360, lineHeight: 1.8 }}>
        That Pokémon doesn&apos;t exist in any known region. Check the name or ID and try again.
      </Typography>
      <Link href="/search" style={{ textDecoration: 'none' }}>
        <Box sx={{ fontFamily: PIXEL, fontSize: '15px', letterSpacing: '0.08em', px: 3, py: '10px', borderRadius: '4px', color: '#f0c0c0', border: '2px solid #7a0000', boxShadow: '0 3px 0 #0d0000', cursor: 'pointer', transition: 'all 0.15s', '&:hover': { borderColor: '#cc0000', boxShadow: '0 0 14px rgba(204,0,0,0.4)' } }}>
          ← BACK TO SEARCH
        </Box>
      </Link>
    </Box>
  )
}
