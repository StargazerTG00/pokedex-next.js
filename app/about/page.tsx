import Image from 'next/image'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PIXEL = 'var(--font-press-start), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const TECH_STACK = [
  { label: 'Node.js',    color: '#68a063' },
  { label: 'Next.js',   color: '#ffffff' },
  { label: 'React',     color: '#61dafb' },
  { label: 'Python',    color: '#ffd343' },
  { label: 'FastAPI',   color: '#009688' },
  { label: 'MongoDB',   color: '#47a248' },
  { label: 'TypeScript',color: '#3178c6' },
  { label: 'JavaScript',color: '#f7df1e' },
  { label: 'REST APIs', color: '#f8d030' },
  { label: 'CSS',       color: '#264de4' },
  { label: 'HTML',      color: '#e34c26' },
]

const AI_TOOLS = [
  { label: 'Claude',           color: '#cc6600', desc: 'Agent-driven development' },
  { label: 'Cursor',           color: '#9966ff', desc: 'AI-powered IDE' },
  { label: 'Agentic Workflow', color: '#ff6688', desc: 'LLM-assisted engineering' },
]

const LANGUAGES = [
  { label: 'Spanish',    flag: '🇨🇱', level: 'Native'       },
  { label: 'English',    flag: '🇺🇸', level: 'Professional'  },
  { label: 'Portuguese', flag: '🇧🇷', level: 'Proficient'    },
]

const INTERESTS = [
  { icon: '🎮', label: 'Gaming',     desc: 'Pokémon, RPGs, anything with a good story' },
  { icon: '🎵', label: 'Music',      desc: 'Always with headphones on' },
  { icon: '✈️', label: 'Travelling', desc: 'Exploring new places, cultures & food' },
  { icon: '🌱', label: 'Simplicity', desc: 'Enjoying the little things in life' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#cc0000', letterSpacing: '0.3em', mb: 1, textTransform: 'uppercase' }}>
      {children}
    </Typography>
  )
}

function Divider({ color = '#cc0000' }: { color?: string }) {
  return (
    <Box sx={{ height: '1px', background: `linear-gradient(90deg, transparent, ${color}88, transparent)`, my: 0.5 }} />
  )
}

export default function AboutPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 45%, #000000 100%)',
        px: { xs: 2, sm: 4, md: 6 },
        py: 6,
      }}
    >
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>

        {/* ── Page header ── */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <SectionLabel>TRAINER CARD</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '13px', sm: '18px' }, color: '#f8d030', textShadow: '0 0 18px rgba(248,208,48,0.6)', letterSpacing: '0.12em', mb: 2 }}>
            ABOUT ME
          </Typography>
          <Box sx={{ mx: 'auto', maxWidth: 260, height: '2px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', boxShadow: '0 0 8px rgba(248,208,48,0.25)' }} />
        </Box>

        {/* ── Trainer card ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            background: 'linear-gradient(160deg, #1e0000 0%, #120000 60%, #0a0008 100%)',
            border: '2px solid #3d0000',
            borderRadius: '10px',
            p: { xs: 3, sm: 4, md: 5 },
            boxShadow: '0 0 40px rgba(204,0,0,0.1), 0 12px 40px rgba(0,0,0,0.8)',
            mb: 4,
          }}
        >
          {/* Left — photo + links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, flexShrink: 0 }}>
            {/* Photo */}
            <Box
              sx={{
                position: 'relative',
                width: 240,
                height: 240,
                borderRadius: '50%',
                border: '3px solid #cc0000',
                boxShadow: '0 0 0 1px #3d0000, 0 0 30px rgba(204,0,0,0.4)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Image
                src="/me.jpg"
                alt="Guillermo Toloza"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 70%' }}
                priority
              />
            </Box>

            {/* Name plate */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#f8d030', letterSpacing: '0.1em', mb: 0.5 }}>
                GUILLERMO TOLOZA
              </Typography>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '8.5px', color: '#cc0000', letterSpacing: '0.15em' }}>
                GUZMÁN
              </Typography>
            </Box>

            <Divider />

            {/* Social links */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', minWidth: 160 }}>
              {[
                { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/guillermo-toloza-guzman/', color: '#0a8fc4', bg: '#0a8fc414' },
                { label: 'GITHUB',   href: 'https://github.com/GuillermoTG00', color: '#aaaaaa', bg: '#aaaaaa0a' },
              ].map(({ label, href, color, bg }) => (
                <Box
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontFamily: PIXEL, fontSize: '9px', letterSpacing: '0.1em', px: 2, py: '8px', borderRadius: '4px', textDecoration: 'none', color, border: `1.5px solid ${color}44`, background: bg, transition: 'all 0.18s', '&:hover': { border: `1.5px solid ${color}`, boxShadow: `0 0 12px ${color}33` } }}
                >
                  {label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right — bio */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Title */}
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#cc0000', letterSpacing: '0.2em', mb: 0.75 }}>
                SOFTWARE DEVELOPER
              </Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#906060', letterSpacing: '0.05em' }}>
                4+ years of experience
              </Typography>
            </Box>

            <Divider />

            {/* Professional bio */}
            <Box>
              <SectionLabel>{'// PROFESSIONAL'}</SectionLabel>
              <Typography sx={{ fontFamily: MONO, fontSize: '14px', color: '#c8a0a0', lineHeight: 1.9 }}>
                Software developer with 4+ years of experience building web applications and scalable backend systems.
                I work across the full stack — crafting responsive UIs with React and Next.js, and building backend
                services and APIs with either Node.js or Python with FastAPI, depending on the project.
              </Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: '14px', color: '#c8a0a0', lineHeight: 1.9, mt: 1.5 }}>
                I enjoy turning complex requirements into clean, maintainable code and I take pride in writing software
                that actually makes people&apos;s lives easier. I love new challenges — whether that means picking up a new
                framework, diving into Python or Node.js for backend services, or exploring agentic AI-driven workflows.
              </Typography>
            </Box>

            {/* Tech stack */}
            <Box>
              <SectionLabel>{'// TECH STACK'}</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {TECH_STACK.map(({ label, color }) => (
                  <Box
                    key={label}
                    sx={{
                      fontFamily: PIXEL, fontSize: '8.5px', letterSpacing: '0.06em',
                      color, border: `1px solid ${color}44`, background: `${color}0e`,
                      borderRadius: '3px', px: '10px', py: '5px', transition: 'all 0.15s',
                      '&:hover': { border: `1px solid ${color}99`, background: `${color}1e`, boxShadow: `0 0 8px ${color}33` },
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* AI & agentic tools */}
            <Box>
              <SectionLabel>{'// AI & AGENTIC DEV'}</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                {AI_TOOLS.map(({ label, color, desc }) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex', flexDirection: 'column', gap: '2px',
                      background: `${color}0e`, border: `1px solid ${color}44`,
                      borderRadius: '4px', px: '10px', py: '6px',
                      transition: 'all 0.15s',
                      '&:hover': { border: `1px solid ${color}88`, background: `${color}1a`, boxShadow: `0 0 8px ${color}33` },
                    }}
                  >
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '8.5px', color, letterSpacing: '0.06em', lineHeight: 1 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontFamily: MONO, fontSize: '10px', color: `${color}99`, lineHeight: 1.3 }}>
                      {desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Languages */}
            <Box>
              <SectionLabel>{'// LANGUAGES'}</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {LANGUAGES.map(({ label, flag, level }) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      background: '#0d0000', border: '1px solid #2a0000',
                      borderRadius: '4px', px: '10px', py: '6px',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#cc000055', boxShadow: '0 0 8px rgba(204,0,0,0.15)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', lineHeight: 1 }}>{flag}</Typography>
                    <Box>
                      <Typography sx={{ fontFamily: PIXEL, fontSize: '8.5px', color: '#f0c0c0', letterSpacing: '0.06em', lineHeight: 1 }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontFamily: MONO, fontSize: '10px', color: '#a06060', lineHeight: 1.4 }}>
                        {level}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </Box>

        {/* ── Personal section ── */}
        <Box
          sx={{
            background: 'linear-gradient(160deg, #1a0000 0%, #0f0000 100%)',
            border: '1px solid #2a0000',
            borderRadius: '10px',
            p: { xs: 3, sm: 4, md: 5 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            mb: 4,
          }}
        >
          <SectionLabel>{'// PERSONAL'}</SectionLabel>
          <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#f8d030', letterSpacing: '0.1em', mb: 3 }}>
            OUTSIDE THE CODE
          </Typography>

          <Typography sx={{ fontFamily: MONO, fontSize: '14px', color: '#c8a0a0', lineHeight: 1.95, mb: 3 }}>
            Outside of work I&apos;m a pretty chill, relaxed person who genuinely enjoys the simple things in life.
            I&apos;m not the kind of person who needs a packed schedule to feel fulfilled — a good game,
            some music in the background, or a random trip somewhere new is usually all I need.
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: '14px', color: '#c8a0a0', lineHeight: 1.95, mb: 4 }}>
            I tend to find value in the little moments and I think that&apos;s something that quietly shows up in how I
            build things too — attention to the details that most people don&apos;t notice but everyone feels.
          </Typography>

          {/* Interests grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
            {INTERESTS.map(({ icon, label, desc }) => (
              <Box
                key={label}
                sx={{
                  background: '#0d0000',
                  border: '1px solid #2a0000',
                  borderRadius: '6px',
                  p: 2,
                  textAlign: 'center',
                  transition: 'all 0.18s',
                  '&:hover': { border: '1px solid #cc000055', boxShadow: '0 0 14px rgba(204,0,0,0.12)' },
                }}
              >
                <Typography sx={{ fontSize: '28px', mb: 1, display: 'block', lineHeight: 1 }}>{icon}</Typography>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '8.5px', color: '#f8d030', letterSpacing: '0.1em', mb: 0.75 }}>
                  {label.toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#906060', lineHeight: 1.7 }}>
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── This project ── */}
        <Box
          sx={{
            background: '#080808',
            border: '1px solid #1e1e1e',
            borderLeft: '3px solid #cc0000',
            borderRadius: '4px',
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            mb: 5,
          }}
        >
          <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.2em', mb: 1.5 }}>
            {'// THIS PROJECT'}
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#886868', lineHeight: 2 }}>
            This Pokédex was built with Next.js 16 App Router, experimenting with server components, ISR caching,
            and the new APIs. It&apos;s a passion project that combines clean web tech with the aesthetic of the GBA games
            that shaped my childhood — powered by PokéAPI, deployed with love.
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#886868', lineHeight: 2, mt: 1 }}>
            Also an excuse to keep playing Pokémon on my Switch 2 (Truly loving it, really).
          </Typography>
        </Box>

        {/* ── Back to home ── */}
        <Box sx={{ textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.1em', border: '1px solid #3d0000', borderRadius: '4px', px: 3, py: '9px', cursor: 'pointer', transition: 'all 0.15s', '&:hover': { color: '#f0c0c0', borderColor: '#cc0000', boxShadow: '0 0 12px rgba(204,0,0,0.25)' } }}
            >
              ← BACK TO HOME
            </Box>
          </Link>
        </Box>

      </Box>
    </Box>
  )
}
