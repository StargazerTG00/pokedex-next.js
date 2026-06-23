import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type GitHubUser = {
  login: string
  name: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

async function fetchGitHub(): Promise<GitHubUser | null> {
  try {
    const res = await fetch('https://api.github.com/users/GuillermoTG00', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const REGIONS = [
  { name: 'KANTO',  gen: 'GEN I',    games: 'Red · Blue · Yellow',       color: '#cc0000', href: '/search?region=kanto'  },
  { name: 'JOHTO',  gen: 'GEN II',   games: 'Gold · Silver · Crystal',   color: '#c8a800', href: '/search?region=johto'  },
  { name: 'HOENN',  gen: 'GEN III',  games: 'Ruby · Sapphire · Emerald', color: '#0055aa', href: '/search?region=hoenn'  },
  { name: 'SINNOH', gen: 'GEN IV',   games: 'Diamond · Pearl · Platinum',color: '#5566bb', href: '/search?region=sinnoh' },
  { name: 'UNOVA',  gen: 'GEN V',    games: 'Black · White · B2 · W2',   color: '#555555', href: '/search?region=unova'  },
  { name: 'KALOS',  gen: 'GEN VI',   games: 'X · Y',                     color: '#0088cc', href: '/search?region=kalos'  },
  { name: 'ALOLA',  gen: 'GEN VII',  games: 'Sun · Moon · US · UM',      color: '#ff8800', href: '/search?region=alola'  },
  { name: 'GALAR',  gen: 'GEN VIII', games: 'Sword · Shield',            color: '#cc33cc', href: '/search?region=galar'  },
  { name: 'PALDEA', gen: 'GEN IX',   games: 'Scarlet · Violet',          color: '#ee4400', href: '/search?region=paldea' },
]

const TEAM_PREVIEW = [
  { name: 'aggron',    id: 306 },
  { name: 'lapras',    id: 131 },
  { name: 'sceptile',  id: 254 },
  { name: 'haunter',   id: 93  },
  { name: 'swampert',  id: 260 },
  { name: 'tyranitar', id: 248 },
]

const SKILLS = ['Node.js', 'Next.js', 'React', 'Python', 'FastAPI', 'MongoDB', 'TypeScript', 'JavaScript', 'REST APIs']

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#a06060', letterSpacing: '0.25em', mb: 1 }}>
      {children}
    </Typography>
  )
}

function GoldDivider() {
  return (
    <Box sx={{ mx: 'auto', maxWidth: 500, height: '2px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', boxShadow: '0 0 12px rgba(248,208,48,0.35)', my: 6 }} />
  )
}

export default async function Home() {
  const github = await fetchGitHub()

  return (
    <Box
      component="main"
      sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 45%, #000000 100%)', color: '#f0f0f0' }}
    >

      {/* ── HERO ── */}
      <Box sx={{ textAlign: 'center', px: { xs: 3, sm: 6 }, pt: { xs: 8, sm: 12 }, pb: 8, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', opacity: 0.03, pointerEvents: 'none', userSelect: 'none', fontSize: '600px', lineHeight: 1 }}>◉</Box>

        <SectionLabel>WELCOME TO</SectionLabel>
        <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '20px', sm: '28px', md: '36px' }, color: '#f8d030', textShadow: '0 0 24px rgba(248,208,48,0.8), 0 0 60px rgba(248,208,48,0.35)', letterSpacing: '0.1em', lineHeight: 1.5, mb: 2 }}>
          POKÉDEX
        </Typography>
        <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '8px', sm: '10px' }, color: '#cc0000', letterSpacing: '0.3em', mb: 1, textShadow: '0 0 10px rgba(204,0,0,0.6)' }}>
          GBA EDITION
        </Typography>
         <Typography
              sx={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '13px',
                color: '#a06060',
                letterSpacing: '0.05em',
                mb:4
              }}
            >
              BY Guillermo Toloza
            </Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: { xs: '13px', sm: '15px' }, color: '#c8a0a0', maxWidth: 600, mx: 'auto', lineHeight: 1.9, mb: 5 }}>
          A fan-made Pokédex built with love for the GBA era (one of the best). Search any Pokémon, explore every region, hear their cries, and discover the team of a true champion.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {([
            { label: 'SEARCH POKÉMON', href: '/search', primary: true  },
            { label: 'MY TEAM',        href: '/league-champions', primary: false },
          ] as const).map(({ label, href, primary }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  fontFamily: PIXEL, fontSize: '13px', letterSpacing: '0.08em',
                  px: 3, py: '10px', borderRadius: '4px', cursor: 'pointer',
                  color: primary ? '#1a0000' : '#f0c0c0',
                  background: primary ? 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)' : 'transparent',
                  border: primary ? '2px solid #a07000' : '2px solid #7a0000',
                  boxShadow: primary ? '0 0 16px rgba(248,208,48,0.5), inset 0 -2px 0 rgba(0,0,0,0.2)' : '0 3px 0 #0d0000',
                  transition: 'all 0.15s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: primary ? '0 0 28px rgba(248,208,48,0.7)' : '0 0 12px rgba(204,0,0,0.4)' },
                }}
              >
                {label}
              </Box>
            </Link>
          ))}
        </Box>
      </Box>

      <GoldDivider />

      {/* ── SEARCH OVERVIEW ── */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 3, sm: 6 }, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <SectionLabel>FEATURES</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '11px', sm: '14px' }, color: '#f8d030', textShadow: '0 0 12px rgba(248,208,48,0.6)', letterSpacing: '0.1em' }}>
            SEARCH POKÉMON
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[
            { icon: '🔍', title: 'BY NAME OR ID',  desc: 'Look up any Pokémon instantly by its name or Pokédex number. Sprites, stats, types and more.' },
            { icon: '🗺️', title: 'BY REGION',      desc: 'Browse Pokémon filtered by their home region. From Kanto classics to Paldea newcomers.' },
            { icon: '📊', title: 'FULL DATA',       desc: 'Base stats, types, height, weight, animated sprites and cry audio for every Pokémon.' },
          ].map(({ icon, title, desc }) => (
            <Box key={title} sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: '1px solid #3d0000', borderRadius: '6px', p: 3, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.6)', transition: 'border-color 0.2s, box-shadow 0.2s', '&:hover': { borderColor: '#cc0000', boxShadow: '0 0 16px rgba(204,0,0,0.2)' } }}>
              <Typography sx={{ fontSize: '32px', mb: 1.5, lineHeight: 1 }}>{icon}</Typography>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em', mb: 1.5 }}>{title}</Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#c8a0a0', lineHeight: 1.8 }}>{desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <GoldDivider />

      {/* ── REGIONS ── */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, sm: 6 }, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <SectionLabel>EXPLORE</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '11px', sm: '14px' }, color: '#f8d030', textShadow: '0 0 12px rgba(248,208,48,0.6)', letterSpacing: '0.1em' }}>
            ALL REGIONS
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2 }}>
          {REGIONS.map(({ name, gen, games, color, href }) => (
            <Link key={name} href={href} style={{ textDecoration: 'none' }}>
              <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #100000 100%)', border: `1.5px solid ${color}55`, borderRadius: '6px', p: 2, display: 'flex', flexDirection: 'column', gap: 0.75, height: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.5)', transition: 'all 0.2s', cursor: 'pointer', '&:hover': { border: `1.5px solid ${color}`, boxShadow: `0 0 18px ${color}44, 0 8px 24px rgba(0,0,0,0.7)`, transform: 'translateY(-3px)' } }}>
                <Box sx={{ height: '2px', background: color, borderRadius: '1px', boxShadow: `0 0 6px ${color}` }} />
                <Typography sx={{ fontFamily: PIXEL, fontSize: '13px', color: color, letterSpacing: '0.1em', textShadow: `0 0 8px ${color}88` }}>{name}</Typography>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.1em' }}>{gen}</Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#886060', lineHeight: 1.5 }}>{games}</Typography>
              </Box>
            </Link>
          ))}
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <Box sx={{ background: 'linear-gradient(160deg, #2a0a00 0%, #1a0000 100%)', border: '1.5px solid #f8d03055', borderRadius: '6px', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, height: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.5)', transition: 'all 0.2s', cursor: 'pointer', '&:hover': { border: '1.5px solid #f8d030', boxShadow: '0 0 18px rgba(248,208,48,0.3)', transform: 'translateY(-3px)' } }}>
              <Box sx={{ height: '2px', width: '100%', background: '#f8d030', borderRadius: '1px', boxShadow: '0 0 6px #f8d030' }} />
              <Typography sx={{ fontFamily: PIXEL, fontSize: '13px', color: '#f8d030', letterSpacing: '0.1em', textShadow: '0 0 8px rgba(248,208,48,0.6)', mt: 0.5 }}>ALL</Typography>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060' }}>EVERY REGION</Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: '11px', lineHeight: 1 }}>→</Typography>
            </Box>
          </Link>
        </Box>
      </Box>

      <GoldDivider />

      {/* ── TEAM PREVIEW ── */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 3, sm: 6 }, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <SectionLabel>HALL OF FAME</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '11px', sm: '14px' }, color: '#f8d030', textShadow: '0 0 12px rgba(248,208,48,0.6)', letterSpacing: '0.1em', mb: 2 }}>
            MY CHAMPION TEAM
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#c8a0a0', maxWidth: 480, mx: 'auto', lineHeight: 1.8 }}>
            Six carefully chosen Pokémon — my personal Hall of Fame. Each one a champion in their own right.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2.5 }, flexWrap: 'wrap', mb: 4 }}>
          {TEAM_PREVIEW.map(({ name, id }) => (
            <Box key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, background: 'linear-gradient(160deg, #1e0000 0%, #100000 100%)', border: '1px solid #3d0000', borderRadius: '8px', p: 1.5, transition: 'all 0.2s', '&:hover': { borderColor: '#cc0000', transform: 'translateY(-4px)', boxShadow: '0 0 16px rgba(204,0,0,0.3)' } }}>
              <Box component="img" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`} alt={name} sx={{ width: 72, height: 72, imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 8px rgba(204,0,0,0.4))' }} />
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#f0c0c0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{name}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/league-champions" style={{ textDecoration: 'none' }}>
            <Box sx={{ fontFamily: PIXEL, fontSize: '13px', letterSpacing: '0.08em', px: 3, py: '10px', borderRadius: '4px', color: '#f0c0c0', border: '2px solid #7a0000', boxShadow: '0 3px 0 #0d0000', transition: 'all 0.15s', display: 'inline-block', cursor: 'pointer', '&:hover': { borderColor: '#cc0000', boxShadow: '0 0 14px rgba(204,0,0,0.4)', transform: 'translateY(-2px)' } }}>
              VIEW FULL TEAM →
            </Box>
          </Link>
        </Box>
      </Box>

      <GoldDivider />

      {/* ── ABOUT ME ── */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 3, sm: 6 }, pb: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <SectionLabel>THE TRAINER</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '11px', sm: '14px' }, color: '#f8d030', textShadow: '0 0 12px rgba(248,208,48,0.6)', letterSpacing: '0.1em' }}>
            ABOUT ME
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: '1px solid #3d0000', borderRadius: '8px', p: { xs: 3, sm: 4 }, boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>

          {/* Avatar + social */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Box sx={{ position: 'relative', width: 160, height: 160, borderRadius: '50%', border: '3px solid #cc0000', boxShadow: '0 0 24px rgba(204,0,0,0.5)', overflow: 'hidden', flexShrink: 0 }}>
              <Image src="/me.jpg" alt="Guillermo Toloza" fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            </Box>
            {github && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[{ label: 'REPOS', value: github.public_repos }, { label: 'FOLLOWERS', value: github.followers }].map(({ label, value }) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#f8d030' }}>{value}</Typography>
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#a06060', letterSpacing: '0.1em', mt: 0.25 }}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              {[
                { icon: '💼', label: 'LINKEDIN', href: 'https://www.linkedin.com/in/guillermo-toloza-guzman/', color: '#0088cc' },
                { icon: '🐙', label: 'GITHUB',   href: github?.html_url ?? 'https://github.com/GuillermoTG00', color: '#aaaaaa' },
              ].map(({ icon, label, href, color }) => (
                <Box key={label} component="a" href={href} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: PIXEL, fontSize: '11px', letterSpacing: '0.08em', px: 2, py: '7px', borderRadius: '4px', textDecoration: 'none', color: color, border: `1.5px solid ${color}55`, background: `${color}0a`, transition: 'all 0.15s', '&:hover': { border: `1.5px solid ${color}`, boxShadow: `0 0 10px ${color}44` } }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bio */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#f8d030', textShadow: '0 0 10px rgba(248,208,48,0.5)', letterSpacing: '0.08em', mb: 0.5 }}>
                GUILLERMO TOLOZA GUZMÁN
              </Typography>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#cc0000', letterSpacing: '0.15em' }}>
                SOFTWARE DEVELOPER · 4+ YRS EXP
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#c8a0a0', lineHeight: 1.9 }}>
              Hey! I&apos;m Guillermo — software developer with 4+ years of experience building full-stack web apps and backend services.
              React, Next.js on the frontend — Node.js or Python with FastAPI on the backend. Clean code, good UX, simple solutions.
            </Typography>
            <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#c8a0a0', lineHeight: 1.9 }}>
              Outside of work I&apos;m a chill person who enjoys videogames, music, travelling and the little things in life.
              This Pokédex is what happens when those worlds collide.
            </Typography>
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#a06060', letterSpacing: '0.15em', mb: 1.5 }}>TECH STACK</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {SKILLS.map((skill) => (
                  <Chip key={skill} label={skill} size="small" sx={{ fontFamily: MONO, fontSize: '15px', background: '#1e0000', color: '#f0c0c0', border: '1px solid #5a0000', borderRadius: '3px', height: '22px', '& .MuiChip-label': { px: '8px' } }} />
                ))}
              </Box>
            </Box>
          </Box>

        </Box>

        {/* See more link */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, fontFamily: PIXEL, fontSize: '9px', letterSpacing: '0.12em', color: '#a06060', border: '1px solid #3d0000', borderRadius: '4px', px: 3, py: '10px', cursor: 'pointer', transition: 'all 0.18s', '&:hover': { color: '#f8d030', borderColor: '#cc0000', boxShadow: '0 0 14px rgba(204,0,0,0.25)' } }}>
              SEE FULL PROFILE →
            </Box>
          </Link>
        </Box>

      </Box>

      {/* ── DEV NOTE ── */}
      <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 3, sm: 6 }, pb: 10 }}>
        <Box
          sx={{
            background: '#080808',
            border: '1px solid #1e1e1e',
            borderLeft: '3px solid #cc0000',
            borderRadius: '4px',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          }}
        >
          <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.2em', mb: 1.5 }}>
            // DEV NOTE
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#886868', lineHeight: 2 }}>
            This project was made with Next.js, experimenting with libraries and new functionalities —
            also a way to kill some time doing side projects about things I love.
            Pokémon being one of them, since I&apos;ve been playing multiple Pokémon games on my Switch 2.
          </Typography>
        </Box>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ textAlign: 'center', pb: 4 }}>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#3d1010', letterSpacing: '0.15em' }}>
          POWERED BY POKEAPI.CO · BUILT BY GUILLERMO TOLOZA
        </Typography>
      </Box>

    </Box>
  )
}
