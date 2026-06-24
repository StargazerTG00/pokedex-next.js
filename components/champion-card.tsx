'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  normal:   { bg: '#2a2a1a', border: '#888860', text: '#c8c890', glow: '#88886044' },
  fire:     { bg: '#2a0a00', border: '#cc3300', text: '#ff6644', glow: '#cc330044' },
  water:    { bg: '#001a2a', border: '#0077dd', text: '#44aaff', glow: '#0077dd44' },
  grass:    { bg: '#001a00', border: '#009900', text: '#44dd44', glow: '#00990044' },
  electric: { bg: '#1a1a00', border: '#ddbb00', text: '#ffee00', glow: '#ddbb0044' },
  ice:      { bg: '#001a2a', border: '#44bbdd', text: '#88ddee', glow: '#44bbdd44' },
  fighting: { bg: '#1a0000', border: '#aa0000', text: '#dd4444', glow: '#aa000044' },
  poison:   { bg: '#1a001a', border: '#992299', text: '#dd66dd', glow: '#99229944' },
  ground:   { bg: '#1a1000', border: '#aa7700', text: '#ddbb44', glow: '#aa770044' },
  flying:   { bg: '#001a1a', border: '#6688bb', text: '#88bbdd', glow: '#6688bb44' },
  psychic:  { bg: '#1a0010', border: '#dd0077', text: '#ff44aa', glow: '#dd007744' },
  bug:      { bg: '#0a1a00', border: '#559900', text: '#88cc22', glow: '#55990044' },
  rock:     { bg: '#1a1500', border: '#998855', text: '#ccbb66', glow: '#99885544' },
  ghost:    { bg: '#0a0015', border: '#7744aa', text: '#aa77dd', glow: '#7744aa44' },
  dragon:   { bg: '#000a1a', border: '#3355bb', text: '#5577dd', glow: '#3355bb44' },
  dark:     { bg: '#0a0a0a', border: '#555555', text: '#999999', glow: '#55555544' },
  steel:    { bg: '#0a0a1a', border: '#7788aa', text: '#99aacc', glow: '#7788aa44' },
  fairy:    { bg: '#1a001a', border: '#dd55dd', text: '#ff88ff', glow: '#dd55dd44' },
}

const STAT_LABELS: Record<string, string> = {
  hp:               'HP',
  attack:           'ATK',
  defense:          'DEF',
  'special-attack': 'SPA',
  'special-defense':'SPD',
  speed:            'SPE',
}

type Stat = { stat: { name: string }; base_stat: number }

export type ChampionData = {
  id: number
  name: string
  rank: number
  artworkUrl: string
  animatedSprite: string | null
  cryUrl: string | null
  legacyCryUrl: string | null
  types: string[]
  stats: Stat[]
  height: number
  weight: number
}

function StatBar({ name, value, typeColor }: { name: string; value: number; typeColor: string }) {
  const label = STAT_LABELS[name] ?? name.slice(0, 3).toUpperCase()
  const pct = Math.min((value / 255) * 100, 100)
  const barColor = value >= 100 ? '#f8d030' : value >= 60 ? '#cc6600' : '#cc0000'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: '#a06060', width: '32px', flexShrink: 0, textAlign: 'right' }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: '#f0c0c0', width: '24px', flexShrink: 0 }}>
        {value}
      </Typography>
      <Box sx={{ flex: 1, height: '7px', background: '#0d0000', border: `1px solid ${typeColor}33`, borderRadius: '3px', overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${barColor}66 0%, ${barColor} 100%)`, boxShadow: `0 0 6px ${barColor}`, transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }} />
      </Box>
    </Box>
  )
}

function SpeakerIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 22 20" width="14" height="14" fill="none">
      <path d="M2 7h3l5-4v14l-5-4H2V7z" fill="currentColor" opacity={playing ? 1 : 0.7} />
      <rect x="12.5" y="7" width="1.8" height="6" rx="0.9" fill="currentColor" opacity={playing ? 1 : 0.4}>
        {playing && <animate attributeName="height" values="6;9;6" dur="0.55s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="7;5.5;7" dur="0.55s" repeatCount="indefinite" />}
      </rect>
      <rect x="15.5" y="5" width="1.8" height="10" rx="0.9" fill="currentColor" opacity={playing ? 1 : 0.3}>
        {playing && <animate attributeName="height" values="10;14;10" dur="0.7s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="5;3;5" dur="0.7s" repeatCount="indefinite" />}
      </rect>
      <rect x="18.5" y="3" width="1.8" height="14" rx="0.9" fill="currentColor" opacity={playing ? 1 : 0.2}>
        {playing && <animate attributeName="height" values="14;18;14" dur="0.9s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="3;1;3" dur="0.9s" repeatCount="indefinite" />}
      </rect>
    </svg>
  )
}

function RetroSpeakerIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 22 20" width="14" height="14" fill="currentColor">
      <rect x="1" y="7" width="3" height="6" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="4" y="5" width="2" height="2" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="4" y="13" width="2" height="2" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="6" y="3" width="2" height="2" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="6" y="15" width="2" height="2" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="8" y="6" width="2" height="8" rx="0" opacity={playing ? 1 : 0.7} />
      <rect x="12" y="7" width="2" height="6" rx="0" opacity={playing ? 1 : 0.35}>
        {playing && <animate attributeName="height" values="6;3;6" dur="0.4s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="7;8.5;7" dur="0.4s" repeatCount="indefinite" />}
      </rect>
      <rect x="15" y="5" width="2" height="10" rx="0" opacity={playing ? 1 : 0.25}>
        {playing && <animate attributeName="height" values="10;5;10" dur="0.35s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="5;7.5;5" dur="0.35s" repeatCount="indefinite" />}
      </rect>
      <rect x="18" y="3" width="2" height="14" rx="0" opacity={playing ? 1 : 0.2}>
        {playing && <animate attributeName="height" values="14;7;14" dur="0.45s" repeatCount="indefinite" />}
        {playing && <animate attributeName="y" values="3;6.5;3" dur="0.45s" repeatCount="indefinite" />}
      </rect>
    </svg>
  )
}

type Playing = 'latest' | 'legacy' | null

export default function ChampionCard({ data }: { data: ChampionData }) {
  const [showAnimated, setShowAnimated] = useState(true)
  const [playing, setPlaying] = useState<Playing>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const primaryType = data.types[0]
  const ts = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal

  const playCry = useCallback((url: string, which: 'latest' | 'legacy') => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
    }
    if (playing === which) {
      audioRef.current = null
      setPlaying(null)
      return
    }
    const audio = new Audio(url)
    audio.onended = () => setPlaying(null)
    audioRef.current = audio
    audio.play()
    setPlaying(which)
  }, [playing])

  const canAnimate = !!data.animatedSprite

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(170deg, #1e0000 0%, #120000 50%, ${ts.bg} 100%)`,
        border: `2px solid ${ts.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: `0 0 24px ${ts.glow}, 0 10px 40px rgba(0,0,0,0.85)`,
        transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.015)',
          boxShadow: `0 0 40px ${ts.border}66, 0 20px 50px rgba(0,0,0,0.95)`,
        },
      }}
    >
      {/* Top strip */}
      <Box sx={{ height: '3px', background: `linear-gradient(90deg, transparent, ${ts.border}, ${ts.border}cc, ${ts.border}, transparent)`, boxShadow: `0 0 8px ${ts.border}` }} />

      {/* Rank badge */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'linear-gradient(135deg, #f8d030, #c48a00)', border: '1.5px solid #a07000', borderRadius: '3px', px: '6px', py: '2px', boxShadow: '0 0 10px rgba(248,208,48,0.7)' }}>
        <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: '#1a0000', lineHeight: 1 }}>
          #{String(data.rank).padStart(2, '0')}
        </Typography>
      </Box>

      {/* Pokédex ID */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
        <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: ts.border, opacity: 0.65 }}>
          No.{String(data.id).padStart(3, '0')}
        </Typography>
      </Box>

      {/* Sprite area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 5,
          pb: 1,
          background: `radial-gradient(ellipse at 50% 55%, ${ts.border}1a 0%, transparent 72%)`,
          position: 'relative',
          minHeight: '260px',
          cursor: canAnimate ? 'pointer' : 'default',
        }}
        onClick={canAnimate ? () => setShowAnimated((v) => !v) : undefined}
      >
        <Box sx={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: `1px solid ${ts.border}22`, boxShadow: `0 0 60px ${ts.border}11, inset 0 0 60px ${ts.border}0a` }} />
        <Box sx={{ position: 'absolute', width: '170px', height: '170px', borderRadius: '50%', border: `1px dashed ${ts.border}18` }} />

        {showAnimated && data.animatedSprite ? (
          <Box
            component="img"
            src={data.animatedSprite}
            alt={`${data.name} animated`}
            loading="lazy"
            sx={{
              width: 160,
              height: 160,
              imageRendering: 'pixelated',
              filter: `drop-shadow(0 0 20px ${ts.border}cc)`,
              position: 'relative',
              zIndex: 1,
              mt: 2,
            }}
          />
        ) : (
          <Image
            src={data.artworkUrl}
            alt={data.name}
            width={220}
            height={220}
            style={{ imageRendering: 'auto', filter: `drop-shadow(0 4px 24px ${ts.border}aa)`, position: 'relative', zIndex: 1 }}
            priority
          />
        )}

        {canAnimate && (
          <Tooltip title={showAnimated ? 'Show artwork' : 'Show animation'} placement="top">
            <Box
              sx={{
                position: 'absolute',
                bottom: 6,
                right: 10,
                zIndex: 3,
                fontFamily: 'var(--font-press-start), monospace',
                fontSize: '9px',
                color: ts.border,
                opacity: 0.55,
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { opacity: 1 },
                transition: 'opacity 0.15s',
              }}
            >
              {showAnimated ? '▣ ART' : '▶ ANIM'}
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Name + types + cries */}
      <Box sx={{ px: 2, pb: 1, textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: '11px',
            color: '#f8d030',
            textShadow: `0 0 12px rgba(248,208,48,0.7), 0 0 30px ${ts.border}55`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1.4,
            mb: 1,
          }}
        >
          {data.name}
        </Typography>

        {/* Cry buttons */}
        {(data.cryUrl || data.legacyCryUrl) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 1 }}>
            {data.cryUrl && (
              <Tooltip title={playing === 'latest' ? 'Stop' : 'Play modern cry'} placement="top">
                <Box
                  onClick={() => playCry(data.cryUrl!, 'latest')}
                  sx={{ display: 'flex', alignItems: 'center', gap: '5px', px: '9px', py: '5px', cursor: 'pointer', userSelect: 'none', borderRadius: '3px', border: `1px solid ${playing === 'latest' ? '#f8d030' : ts.border + '66'}`, background: playing === 'latest' ? `${ts.border}28` : `${ts.border}0a`, color: playing === 'latest' ? '#f8d030' : ts.border, boxShadow: playing === 'latest' ? `0 0 12px ${ts.border}55` : 'none', transition: 'all 0.15s', '&:hover': { background: `${ts.border}22`, borderColor: ts.border, color: '#f8d030' } }}
                >
                  <SpeakerIcon playing={playing === 'latest'} />
                  <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '7px', letterSpacing: '0.08em', lineHeight: 1 }}>HD</Typography>
                </Box>
              </Tooltip>
            )}
            {data.legacyCryUrl && (
              <Tooltip title={playing === 'legacy' ? 'Stop' : 'Play classic 8-bit cry'} placement="top">
                <Box
                  onClick={() => playCry(data.legacyCryUrl!, 'legacy')}
                  sx={{ display: 'flex', alignItems: 'center', gap: '5px', px: '9px', py: '5px', cursor: 'pointer', userSelect: 'none', borderRadius: '3px', border: `1px solid ${playing === 'legacy' ? '#f8d030' : ts.border + '33'}`, background: playing === 'legacy' ? '#2a1a0033' : '#0a000a', color: playing === 'legacy' ? '#f8d030' : '#906060', boxShadow: playing === 'legacy' ? '0 0 12px #f8d03044' : 'none', transition: 'all 0.15s', '&:hover': { background: `${ts.border}14`, borderColor: `${ts.border}66`, color: '#f8d030' } }}
                >
                  <RetroSpeakerIcon playing={playing === 'legacy'} />
                  <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '7px', letterSpacing: '0.08em', lineHeight: 1 }}>8-BIT</Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
          {data.types.map((t) => {
            const tc = TYPE_COLORS[t] ?? TYPE_COLORS.normal
            return (
              <Chip
                key={t}
                label={t.toUpperCase()}
                size="small"
                sx={{
                  height: '18px',
                  fontFamily: 'var(--font-press-start), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  background: tc.bg,
                  color: tc.text,
                  border: `1px solid ${tc.border}`,
                  borderRadius: '2px',
                  boxShadow: `0 0 6px ${tc.glow}`,
                  '& .MuiChip-label': { px: '6px' },
                }}
              />
            )
          })}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 2, height: '1px', background: `linear-gradient(90deg, transparent, ${ts.border}66, transparent)`, mb: 1.5 }} />

      {/* Stats */}
      <Box sx={{ px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {data.stats.map((s) => (
          <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} typeColor={ts.border} />
        ))}
      </Box>

      {/* Height / Weight */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', px: 2, pb: 2.5, borderTop: `1px solid ${ts.border}22`, pt: 1.5 }}>
        {[
          { label: 'HT', value: `${(data.height / 10).toFixed(1)}m` },
          { label: 'WT', value: `${(data.weight / 10).toFixed(1)}kg` },
        ].map(({ label, value }) => (
          <Box key={label} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: '#a06060', mb: 0.5 }}>
              {label}
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '11px', color: '#f0c0c0' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* View Details button */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Link href={`/search/${data.id}`} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: '10px',
              background: `linear-gradient(90deg, ${ts.border}0a, ${ts.border}22, ${ts.border}0a)`,
              border: `1.5px solid ${ts.border}55`,
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: `linear-gradient(90deg, ${ts.border}22, ${ts.border}44, ${ts.border}22)`,
                borderColor: ts.border,
                boxShadow: `0 0 16px ${ts.border}44`,
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '9px', color: ts.text, letterSpacing: '0.12em' }}>
              VIEW DETAILS
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-press-start), monospace', fontSize: '9px', color: ts.border }}>
              →
            </Typography>
          </Box>
        </Link>
      </Box>

      {/* Bottom strip */}
      <Box sx={{ height: '3px', background: `linear-gradient(90deg, transparent, ${ts.border}88, transparent)` }} />
    </Box>
  )
}
