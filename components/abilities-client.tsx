'use client'

import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

type AbilityItem = { name: string; hidden: boolean }
type AbilityDetail = { effect: string; flavor: string }

export default function AbilitiesClient({ abilities, typeColor }: { abilities: AbilityItem[]; typeColor: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [cache, setCache] = useState<Record<string, AbilityDetail>>({})
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async (name: string) => {
    if (selected === name) { setSelected(null); return }
    setSelected(name)
    if (cache[name]) return
    setLoading(true)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/ability/${name}`)
      const data = await res.json()
      const effect: string = data.effect_entries?.find((e: { language: { name: string }; short_effect: string }) => e.language.name === 'en')?.short_effect ?? ''
      const flavor: string = data.flavor_text_entries?.filter((f: { language: { name: string }; flavor_text: string }) => f.language.name === 'en').slice(-1)[0]?.flavor_text?.replace(/[\n\f]/g, ' ') ?? ''
      setCache(c => ({ ...c, [name]: { effect, flavor } }))
    } catch {
      setCache(c => ({ ...c, [name]: { effect: '', flavor: 'Could not load description.' } }))
    } finally {
      setLoading(false)
    }
  }, [selected, cache])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {abilities.map(({ name, hidden }) => {
        const active = selected === name
        const detail = cache[name]
        return (
          <Box key={name}>
            {/* Clickable ability row */}
            <Box
              onClick={() => handleClick(name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: active ? `${typeColor}14` : '#0d0000',
                border: `1.5px solid ${active ? typeColor + '77' : (hidden ? typeColor + '44' : typeColor + '22')}`,
                borderRadius: active && detail ? '4px 4px 0 0' : '4px',
                px: 2, py: 1.25,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: active ? `0 0 14px ${typeColor}22` : 'none',
                userSelect: 'none',
                '&:hover': {
                  background: `${typeColor}10`,
                  border: `1.5px solid ${typeColor}55`,
                },
              }}
            >
              {/* Active dot */}
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: active ? typeColor : (hidden ? typeColor + '55' : '#2a0000'), boxShadow: active ? `0 0 8px ${typeColor}` : 'none', transition: 'all 0.18s' }} />

              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: active ? '#f8d030' : (hidden ? typeColor : '#f0c0c0'), textTransform: 'capitalize', letterSpacing: '0.06em', flex: 1, transition: 'color 0.18s' }}>
                {name.replace(/-/g, ' ')}
              </Typography>

              {hidden && (
                <Box sx={{ background: `${typeColor}18`, border: `1px solid ${typeColor}44`, borderRadius: '3px', px: '5px', py: '2px' }}>
                  <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: typeColor, letterSpacing: '0.15em' }}>HIDDEN</Typography>
                </Box>
              )}

              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: active ? typeColor : '#3a1a1a', transition: 'color 0.18s' }}>
                {active ? '▲' : '▼'}
              </Typography>
            </Box>

            {/* Expanded detail */}
            {active && (
              <Box sx={{ background: `${typeColor}08`, border: `1.5px solid ${typeColor}44`, borderTop: `1px solid ${typeColor}22`, borderRadius: '0 0 4px 4px', px: 2, py: 1.5 }}>
                {loading && !detail ? (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', background: typeColor, opacity: 0.4, animation: `blink 1s ${i * 0.2}s ease-in-out infinite`, '@keyframes blink': { '0%,100%': { opacity: 0.2 }, '50%': { opacity: 0.8 } } }} />
                    ))}
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', ml: 0.5 }}>LOADING...</Typography>
                  </Box>
                ) : detail ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {detail.effect && (
                      <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#f0c0c0', lineHeight: 1.75 }}>
                        {detail.effect}
                      </Typography>
                    )}
                    {detail.flavor && detail.flavor !== detail.effect && (
                      <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#7a5050', lineHeight: 1.7, fontStyle: 'italic' }}>
                        &ldquo;{detail.flavor}&rdquo;
                      </Typography>
                    )}
                  </Box>
                ) : null}
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
