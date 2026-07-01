'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@/lib/auth-context'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

function PokeballIcon() {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} xmlns="http://www.w3.org/2000/svg">
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

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { register, token } = useAuth()

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // Already logged in → redirect
  useEffect(() => {
    if (token) router.replace('/')
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(username.trim(), email.trim(), password)
      router.replace('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputSx = {
    width: '100%',
    fontFamily: MONO,
    fontSize: '15px',
    color: '#f0f0f0',
    background: '#0d0000',
    border: '1.5px solid #3d0000',
    borderRadius: '5px',
    px: 2,
    height: 50,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus-within': { borderColor: '#cc0000', boxShadow: '0 0 12px rgba(204,0,0,0.2)' },
    '& input::placeholder': { color: '#5a3030', opacity: 1 },
    '& input': { p: 0 },
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>

        {/* Card */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: 'linear-gradient(170deg, #1e0000 0%, #120000 100%)',
            border: '2px solid #3d0000',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(204,0,0,0.12), 0 20px 60px rgba(0,0,0,0.9)',
          }}
        >
          {/* Top strip */}
          <Box sx={{ height: '3px', background: 'linear-gradient(90deg, transparent, #cc0000, #f8d030, #cc0000, transparent)', boxShadow: '0 0 12px rgba(248,208,48,0.4)' }} />

          {/* Header */}
          <Box sx={{ textAlign: 'center', pt: 4, pb: 3, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <PokeballIcon />
            </Box>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.25em', mb: 1 }}>
              NEW TRAINER
            </Typography>
            <Typography sx={{ fontFamily: PIXEL, fontSize: { xs: '14px', sm: '18px' }, color: '#f8d030', textShadow: '0 0 16px rgba(248,208,48,0.7)', letterSpacing: '0.1em' }}>
              REGISTER
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{ mx: 3, height: '1px', background: 'linear-gradient(90deg, transparent, #cc000066, transparent)', mb: 3 }} />

          {/* Fields */}
          <Box sx={{ px: 3, pb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Username */}
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.15em', mb: 1 }}>
                USERNAME
              </Typography>
              <InputBase
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="trainer_name"
                autoComplete="username"
                required
                sx={inputSx}
              />
            </Box>

            {/* Email */}
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.15em', mb: 1 }}>
                EMAIL
              </Typography>
              <InputBase
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainer@pokecenter.com"
                autoComplete="email"
                required
                sx={inputSx}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.15em', mb: 1 }}>
                PASSWORD
              </Typography>
              <InputBase
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                sx={inputSx}
              />
            </Box>

            {/* Confirm password */}
            <Box>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#a06060', letterSpacing: '0.15em', mb: 1 }}>
                CONFIRM PASSWORD
              </Typography>
              <InputBase
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                sx={{
                  ...inputSx,
                  ...(confirm && password !== confirm && {
                    borderColor: '#cc0000',
                    boxShadow: '0 0 8px rgba(204,0,0,0.25)',
                  }),
                }}
              />
              {confirm && password !== confirm && (
                <Typography sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#cc0000', mt: 0.75, letterSpacing: '0.06em' }}>
                  Passwords don&apos;t match
                </Typography>
              )}
            </Box>

            {/* Error */}
            {error && (
              <Box sx={{ background: '#1e0000', border: '1px solid #cc000066', borderRadius: '4px', px: 2, py: 1.5 }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#cc0000', letterSpacing: '0.08em' }}>
                  ✕ {error}
                </Typography>
              </Box>
            )}

            {/* Submit */}
            <Box
              component="button"
              type="submit"
              disabled={loading || (!!confirm && password !== confirm)}
              sx={{
                mt: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                fontFamily: PIXEL, fontSize: '12px', letterSpacing: '0.08em',
                height: 52, borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer',
                color: '#1a0000',
                background: loading
                  ? 'linear-gradient(180deg, #aa8020 0%, #8a6010 100%)'
                  : 'linear-gradient(180deg, #ffe040 0%, #f8d030 50%, #d4a010 100%)',
                border: '2px solid #a07000',
                boxShadow: loading ? 'none' : '0 0 16px rgba(248,208,48,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)',
                transition: 'all 0.15s',
                '&:hover:not(:disabled)': { boxShadow: '0 0 28px rgba(248,208,48,0.65)', transform: 'translateY(-1px)' },
                '&:active:not(:disabled)': { transform: 'translateY(1px)' },
              }}
            >
              {loading ? (
                <CircularProgress size={16} sx={{ color: '#5a4000' }} />
              ) : (
                <PersonIcon />
              )}
              {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', px: 3, pt: 2, pb: 4 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#5a3030' }}>
              Already a trainer?{' '}
              <Box
                component={Link}
                href="/login"
                sx={{ color: '#f8d030', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Login here
              </Box>
            </Typography>
          </Box>

          {/* Bottom strip */}
          <Box sx={{ height: '3px', background: 'linear-gradient(90deg, transparent, #cc000088, transparent)' }} />
        </Box>

      </Box>
    </Box>
  )
}
