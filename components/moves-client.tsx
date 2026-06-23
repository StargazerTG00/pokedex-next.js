'use client'

import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TYPE_COLORS } from '@/lib/type-colors'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

type MoveItem = { name: string; level: number }
type MoveDetail = {
  power: number | null
  pp: number | null
  accuracy: number | null
  damage_class: string
  type: string
  effect: string
  flavor: string
}

const CLASS_COLORS: Record<string, string> = {
  physical: '#cc6600',
  special:  '#0077dd',
  status:   '#555555',
}

export default function MovesClient({ moves, typeColor }: { moves: MoveItem[]; typeColor: string }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [cache, setCache] = useState<Record<string, MoveDetail>>({})
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async (name: string) => {
    if (selected === name) { setSelected(null); return }
    setSelected(name)
    if (cache[name]) return
    setLoading(true)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`)
      const data = await res.json()
      const effect: string = (data.effect_entries?.find((e: { language: { name: string }; short_effect: string }) => e.language.name === 'en')?.short_effect ?? '').replace(/\$effect_chance/g, String(data.effect_chance ?? '?'))
      const flavor: string = data.flavor_text_entries?.filter((f: { language: { name: string }; flavor_text: string }) => f.language.name === 'en').slice(-1)[0]?.flavor_text?.replace(/[\n\f]/g, ' ') ?? ''
      setCache(c => ({
        ...c,
        [name]: {
          power: data.power,
          pp: data.pp,
          accuracy: data.accuracy,
          damage_class: data.damage_class?.name ?? 'status',
          type: data.type?.name ?? 'normal',
          effect,
          flavor,
        },
      }))
    } catch {
      setCache(c => ({ ...c, [name]: { power: null, pp: null, accuracy: null, damage_class: 'status', type: 'normal', effect: '', flavor: 'Could not load details.' } }))
    } finally {
      setLoading(false)
    }
  }, [selected, cache])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {moves.map(({ name, level }) => {
        const active = selected === name
        const detail = cache[name]
        const tc = detail ? (TYPE_COLORS[detail.type] ?? TYPE_COLORS.normal) : null
        const classColor = detail ? (CLASS_COLORS[detail.damage_class] ?? '#555') : typeColor

        return (
          <Box key={name}>
            {/* Move row */}
            <Box
              onClick={() => handleClick(name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: active ? `${typeColor}12` : '#0a0000',
                border: `1px solid ${active ? typeColor + '66' : typeColor + '18'}`,
                borderRadius: active && detail ? '4px 4px 0 0' : '4px',
                px: 1.25, py: '7px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: active ? `0 0 10px ${typeColor}1a` : 'none',
                userSelect: 'none',
                '&:hover': { background: `${typeColor}08`, borderColor: `${typeColor}44` },
              }}
            >
              {/* Level badge */}
              <Box sx={{ flexShrink: 0, background: active ? `${typeColor}22` : '#120000', border: `1px solid ${active ? typeColor + '55' : '#2a0000'}`, borderRadius: '2px', minWidth: 26, textAlign: 'center', px: '4px', py: '2px', transition: 'all 0.18s' }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: active ? typeColor : '#5a3030', letterSpacing: '0.05em' }}>
                  {level === 0 ? 'EVO' : `L${level}`}
                </Typography>
              </Box>

              {/* Move name */}
              <Typography sx={{ fontFamily: PIXEL, fontSize: '13px', color: active ? '#f8d030' : '#e0b0b0', textTransform: 'capitalize', letterSpacing: '0.06em', flex: 1, transition: 'color 0.18s' }}>
                {name.replace(/-/g, ' ')}
              </Typography>

              {/* Quick stats if loaded */}
              {detail && (
                <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  <Box sx={{ background: tc?.bg ?? '#0a0000', border: `1px solid ${tc?.border ?? typeColor}44`, borderRadius: '2px', px: '4px', py: '1px' }}>
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: tc?.text ?? typeColor, letterSpacing: '0.08em' }}>
                      {detail.type.toUpperCase()}
                    </Typography>
                  </Box>
                  <Box sx={{ background: `${classColor}18`, border: `1px solid ${classColor}44`, borderRadius: '2px', px: '4px', py: '1px' }}>
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: classColor, letterSpacing: '0.06em' }}>
                      {detail.damage_class.slice(0, 4).toUpperCase()}
                    </Typography>
                  </Box>
                  {detail.power && (
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#c8a060', letterSpacing: '0.05em', minWidth: 20, textAlign: 'right' }}>
                      {detail.power}
                    </Typography>
                  )}
                </Box>
              )}

              <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: active ? typeColor : '#3a1a1a', transition: 'color 0.18s', ml: 0.25 }}>
                {active ? '▲' : '▼'}
              </Typography>
            </Box>

            {/* Expanded detail */}
            {active && (
              <Box sx={{ background: `${typeColor}07`, border: `1px solid ${typeColor}44`, borderTop: `1px solid ${typeColor}18`, borderRadius: '0 0 4px 4px', px: 2, py: 1.25 }}>
                {loading && !detail ? (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <Box key={i} sx={{ width: 5, height: 5, borderRadius: '50%', background: typeColor, opacity: 0.4, animation: `blink 1s ${i * 0.2}s ease-in-out infinite`, '@keyframes blink': { '0%,100%': { opacity: 0.2 }, '50%': { opacity: 0.8 } } }} />
                    ))}
                  </Box>
                ) : detail ? (
                  <Box>
                    {/* Stat row */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: detail.effect ? 1.25 : 0 }}>
                      {[
                        { label: 'POWER',    value: detail.power != null ? String(detail.power) : '—' },
                        { label: 'ACCURACY', value: detail.accuracy != null ? `${detail.accuracy}%` : '—' },
                        { label: 'PP',       value: detail.pp != null ? String(detail.pp) : '—' },
                        { label: 'CLASS',    value: detail.damage_class.toUpperCase() },
                        { label: 'TYPE',     value: detail.type.toUpperCase() },
                      ].map(({ label, value }) => (
                        <Box key={label} sx={{ background: '#0d0000', border: `1px solid ${typeColor}22`, borderRadius: '3px', px: 1.25, py: '5px', minWidth: 52 }}>
                          <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.15em', mb: '3px' }}>{label}</Typography>
                          <Typography sx={{ fontFamily: MONO, fontSize: '13px', color: '#f0c0c0' }}>{value}</Typography>
                        </Box>
                      ))}
                    </Box>

                    {detail.effect && (
                      <Typography sx={{ fontFamily: MONO, fontSize: '15px', color: '#e0a0a0', lineHeight: 1.75, mb: detail.flavor ? 0.5 : 0 }}>
                        {detail.effect}
                      </Typography>
                    )}
                    {detail.flavor && (
                      <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#6a4040', lineHeight: 1.7, fontStyle: 'italic' }}>
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
