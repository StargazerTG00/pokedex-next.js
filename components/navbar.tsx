'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

function PokeballIcon({ size = 28 }: { size?: number }) {
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  )
}

const SEARCH_STORAGE_KEY = 'pokedex_search'

const navItems = [
  { label: 'HOME',      href: '/',                clearSearch: false },
  { label: 'SEARCH',    href: '/search',          clearSearch: true  },
  { label: 'CHAMPIONS', href: '/league-champions', clearSearch: false },
  { label: 'ABOUT',     href: '/about',           clearSearch: false },
]

export default function Navbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavClick = (clearSearch: boolean) => {
    if (clearSearch) sessionStorage.removeItem(SEARCH_STORAGE_KEY)
    setDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="static" component="header" enableColorOnDark sx={{ overflow: 'hidden' }}>
        <Toolbar
          sx={{
            width: '100%',
            maxWidth: '1100px',
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 56, sm: 64 },
            gap: 2,
          }}
        >
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
            <Box sx={{ transition: 'transform 0.3s', lineHeight: 0, flexShrink: 0 }}>
              <PokeballIcon size={28} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#f8d030',
                  textShadow: '0 0 8px rgba(248,208,48,0.7)',
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                }}
              >
                POKÉDEX
              </Typography>
              <Typography
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '11px',
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

          {/* Desktop nav buttons — hidden on xs */}
          <Box
            component="ul"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: '6px',
              listStyle: 'none',
              m: 0,
              p: 0,
              flexShrink: 0,
            }}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Box component="li" key={item.href}>
                  <Button
                    component={Link}
                    href={item.href}
                    onClick={() => handleNavClick(item.clearSearch)}
                    disableRipple={false}
                    sx={{
                      fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                      fontSize: '12px',
                      letterSpacing: '0.04em',
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
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: isActive
                          ? 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)'
                          : 'linear-gradient(180deg, #6e0000 0%, #4d0000 100%)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Box>
              )
            })}
          </Box>

          {/* Hamburger button — visible only on xs */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              display: { xs: 'flex', sm: 'none' },
              color: '#f0c0c0',
              border: '2px solid #7a0000',
              borderRadius: '4px',
              p: '6px',
              background: 'linear-gradient(180deg, #5a0000 0%, #3d0000 100%)',
              boxShadow: '0 3px 0 #0d0000',
              '&:hover': { background: 'linear-gradient(180deg, #6e0000 0%, #4d0000 100%)' },
            }}
          >
            <HamburgerIcon open={false} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            background: '#0d0000',
            border: 'none',
            borderLeft: '2px solid #3d0000',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.9)',
          },
          '& .MuiBackdrop-root': {
            background: 'rgba(0,0,0,0.7)',
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid #2a0000',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PokeballIcon size={22} />
            <Typography
              sx={{
                fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                fontSize: '11px',
                color: '#f8d030',
                letterSpacing: '0.12em',
              }}
            >
              POKÉDEX
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            sx={{ color: '#a06060', p: '4px', '&:hover': { color: '#f0c0c0' } }}
          >
            <HamburgerIcon open={true} />
          </IconButton>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1.5, pb: 3, px: 2 }}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Box
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => handleNavClick(item.clearSearch)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  px: 2,
                  py: '14px',
                  borderRadius: '4px',
                  mb: 0.5,
                  color: isActive ? '#f8d030' : '#f0c0c0',
                  background: isActive ? '#1e0000' : 'transparent',
                  border: `1.5px solid ${isActive ? '#cc0000' : 'transparent'}`,
                  transition: 'all 0.15s',
                  '&:hover': {
                    background: '#180000',
                    borderColor: '#4d0000',
                    color: '#f8d030',
                  },
                }}
              >
                {/* Active indicator */}
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isActive ? '#cc0000' : 'transparent',
                    border: `1px solid ${isActive ? '#cc0000' : '#3d0000'}`,
                    boxShadow: isActive ? '0 0 6px #cc0000' : 'none',
                  }}
                />
                {item.label}
              </Box>
            )
          })}
        </Box>

        {/* Drawer footer */}
        <Box sx={{ mt: 'auto', px: 2.5, pb: 3, borderTop: '1px solid #1a0000', pt: 2 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '10px',
              color: '#3d1010',
              letterSpacing: '0.05em',
            }}
          >
            BY Guillermo Toloza
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}
