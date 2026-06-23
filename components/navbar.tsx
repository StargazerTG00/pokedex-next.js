'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function PokeballIcon({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" fill="#1a0000" stroke="#cc0000" strokeWidth="1.5" />
      <path d="M1.5 20 A18.5 18.5 0 0 1 38.5 20" fill="#cc0000" />
      <path d="M1.5 20 A18.5 18.5 0 0 0 38.5 20" fill="#f0f0f0" />
      <rect x="1.5" y="17.5" width="37" height="5" fill="#1a0000" />
      <circle cx="20" cy="20" r="7" fill="#1a0000" stroke="#cc0000" strokeWidth="0.75" />
      <circle cx="20" cy="20" r="5" fill="#e8e8e8" />
      <circle cx="20" cy="20" r="2.5" fill="#bdbdbd" />
    </svg>
  )
}

const SEARCH_STORAGE_KEY = 'pokedex_search'

const navItems = [
  { label: 'HOME',      shortLabel: 'HM', href: '/',                clearSearch: false },
  { label: 'SEARCH',    shortLabel: 'SR', href: '/search',          clearSearch: true  },
  { label: 'CHAMPIONS', shortLabel: 'CH', href: '/league-champions', clearSearch: false },
  { label: 'ABOUT',     shortLabel: 'AB', href: '/about',           clearSearch: false },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <AppBar position="static" component="header" enableColorOnDark>
      <Toolbar sx={{ maxWidth: '900px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, gap: 2 }}>

        {/* Logo */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
            textDecoration: 'none',
            '&:hover svg': { transform: 'rotate(20deg)', transition: 'transform 0.3s' },
          }}
        >
          <Box sx={{ transition: 'transform 0.3s', lineHeight: 0 }}>
            <PokeballIcon />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                fontSize: '15px',
                color: '#f8d030',
                textShadow: '0 0 8px rgba(248,208,48,0.7)',
                letterSpacing: '0.15em',
                lineHeight: 1,
              }}
            >
              POKÉDEX
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '13px',
                color: '#a06060',
                letterSpacing: '0.05em',
                lineHeight: 1,
              }}
            >
              BY Guillermo Toloza
            </Typography>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Nav buttons */}
        <Box component="ul" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, listStyle: 'none', m: 0, p: 0 }}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(item.href + '/')

            return (
              <Box component="li" key={item.href}>
                <Button
                  component={Link}
                  href={item.href}
                  onClick={item.clearSearch ? () => sessionStorage.removeItem(SEARCH_STORAGE_KEY) : undefined}
                  disableRipple={false}
                  sx={{
                    fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                    fontSize: '15px',
                    letterSpacing: '0.06em',
                    px: '10px',
                    py: '7px',
                    minWidth: 0,
                    borderRadius: '3px',
                    color: isActive ? '#1a0000' : '#f0c0c0',
                    background: isActive
                      ? 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)'
                      : 'linear-gradient(180deg, #5a0000 0%, #3d0000 100%)',
                    border: `2px solid ${isActive ? '#a07000' : '#7a0000'}`,
                    boxShadow: isActive
                      ? 'inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)'
                      : '0 3px 0 #0d0000, inset 0 1px 0 rgba(255,255,255,0.06)',
                    transform: isActive ? 'translateY(2px)' : 'translateY(0)',
                    transition: 'all 0.1s',
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)'
                        : 'linear-gradient(180deg, #6e0000 0%, #4d0000 100%)',
                    },
                    // Show short label on xs, full label on sm+
                    '& .full': { display: { xs: 'none', sm: 'inline' } },
                    '& .short': { display: { xs: 'inline', sm: 'none' } },
                  }}
                >
                  <span className="full">{item.label}</span>
                  <span className="short">{item.shortLabel}</span>
                </Button>
              </Box>
            )
          })}
        </Box>

      </Toolbar>
    </AppBar>
  )
}
