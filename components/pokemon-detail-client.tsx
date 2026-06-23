'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const PIXEL = 'var(--font-press-start), monospace'

function SpeakerIcon({ playing, size = 15 }: { playing: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 22 20" width={size} height={size} fill="none">
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

function RetroSpeakerIcon({ playing, size = 15 }: { playing: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 22 20" width={size} height={size} fill="currentColor">
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

type Props = {
  artworkUrl: string
  animatedSprite: string | null
  cryUrl: string | null
  legacyCryUrl: string | null
  name: string
  typeColor: string
}

type Playing = 'latest' | 'legacy' | null

export default function PokemonDetailClient({ artworkUrl, animatedSprite, cryUrl, legacyCryUrl, name, typeColor }: Props) {
  const [showAnimated, setShowAnimated] = useState(!!animatedSprite)
  const [playing, setPlaying] = useState<Playing>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', pt: 2, pb: 1, background: `radial-gradient(ellipse at 50% 55%, ${typeColor}18 0%, transparent 70%)`, minHeight: 220 }}>
      <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: `1px solid ${typeColor}18` }} />
      <Box sx={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', border: `1px dashed ${typeColor}12` }} />

      {showAnimated && animatedSprite ? (
        <Box component="img" src={animatedSprite} alt={`${name} animated`}
          sx={{ width: 160, height: 160, imageRendering: 'pixelated', filter: `drop-shadow(0 0 20px ${typeColor}cc)`, position: 'relative', zIndex: 1, mt: 3 }}
        />
      ) : (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Image src={artworkUrl} alt={name} width={200} height={200}
            style={{ imageRendering: 'auto', filter: `drop-shadow(0 4px 24px ${typeColor}aa)` }} priority
          />
        </Box>
      )}

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 0.75, mt: 1.5, zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {animatedSprite && (
          <Tooltip title={showAnimated ? 'Show artwork' : 'Show animation'} placement="top">
            <Box onClick={() => setShowAnimated(v => !v)}
              sx={{ fontFamily: PIXEL, fontSize: '8.5px', color: typeColor, border: `1px solid ${typeColor}55`, borderRadius: '3px', px: '8px', py: '5px', cursor: 'pointer', background: `${typeColor}0a`, userSelect: 'none', transition: 'all 0.15s', '&:hover': { background: `${typeColor}22`, borderColor: typeColor } }}
            >
              {showAnimated ? '▣ ART' : '▶ ANIM'}
            </Box>
          </Tooltip>
        )}

        {cryUrl && (
          <Tooltip title={playing === 'latest' ? 'Stop' : 'Play modern cry'} placement="top">
            <Box onClick={() => playCry(cryUrl, 'latest')}
              sx={{ display: 'flex', alignItems: 'center', gap: '5px', px: '9px', py: '5px', cursor: 'pointer', userSelect: 'none', borderRadius: '3px', border: `1px solid ${playing === 'latest' ? '#f8d030' : typeColor + '66'}`, background: playing === 'latest' ? `${typeColor}28` : `${typeColor}0a`, color: playing === 'latest' ? '#f8d030' : typeColor, boxShadow: playing === 'latest' ? `0 0 12px ${typeColor}55` : 'none', transition: 'all 0.15s', '&:hover': { background: `${typeColor}22`, borderColor: typeColor, color: '#f8d030' } }}
            >
              <SpeakerIcon playing={playing === 'latest'} />
              <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', letterSpacing: '0.08em', lineHeight: 1 }}>HD</Typography>
            </Box>
          </Tooltip>
        )}

        {legacyCryUrl && (
          <Tooltip title={playing === 'legacy' ? 'Stop' : 'Play classic 8-bit cry'} placement="top">
            <Box onClick={() => playCry(legacyCryUrl, 'legacy')}
              sx={{ display: 'flex', alignItems: 'center', gap: '5px', px: '9px', py: '5px', cursor: 'pointer', userSelect: 'none', borderRadius: '3px', border: `1px solid ${playing === 'legacy' ? '#f8d030' : typeColor + '33'}`, background: playing === 'legacy' ? '#2a1a0033' : '#0a000a', color: playing === 'legacy' ? '#f8d030' : '#906060', boxShadow: playing === 'legacy' ? '0 0 12px #f8d03044' : 'none', transition: 'all 0.15s', '&:hover': { background: `${typeColor}14`, borderColor: `${typeColor}66`, color: '#f8d030' } }}
            >
              <RetroSpeakerIcon playing={playing === 'legacy'} />
              <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', letterSpacing: '0.08em', lineHeight: 1 }}>8-BIT</Typography>
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
