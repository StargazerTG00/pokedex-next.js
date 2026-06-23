'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const VERSION_LABELS: Record<string, string> = {
  'heartgold': 'HeartGold', 'soulsilver': 'SoulSilver',
  'firered': 'FireRed', 'leafgreen': 'LeafGreen',
  'lets-go-pikachu': "Let's Go P", 'lets-go-eevee': "Let's Go E",
  'black-2': 'Black 2', 'white-2': 'White 2',
  'omega-ruby': 'Omega Ruby', 'alpha-sapphire': 'Alpha Sapphire',
  'ultra-sun': 'Ultra Sun', 'ultra-moon': 'Ultra Moon',
  'scarlet': 'Scarlet', 'violet': 'Violet',
  'brilliant-diamond': 'BD', 'shining-pearl': 'SP',
  'legends-arceus': 'Legends',
}

function fmtVersion(v: string) {
  return VERSION_LABELS[v] ?? (v.charAt(0).toUpperCase() + v.slice(1))
}

type Entry = { version: string; text: string }

export default function PokedexEntriesClient({ entries, typeColor }: { entries: Entry[]; typeColor: string }) {
  const [selected, setSelected] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {entries.map(({ version, text }, i) => {
        const active = selected === i
        return (
          <Box
            key={i}
            onClick={() => setSelected(i)}
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              background: active ? `${typeColor}12` : '#0d0000',
              border: `1px solid ${active ? typeColor + '66' : typeColor + '18'}`,
              borderRadius: '4px',
              p: 1.5,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: active ? `0 0 14px ${typeColor}22, inset 0 0 20px ${typeColor}08` : 'none',
              '&:hover': {
                border: `1px solid ${typeColor}44`,
                background: `${typeColor}08`,
              },
            }}
          >
            {/* Active indicator bar */}
            <Box sx={{ flexShrink: 0, width: '2px', alignSelf: 'stretch', minHeight: 20, background: active ? typeColor : 'transparent', borderRadius: '2px', transition: 'background 0.18s', mr: 0.25 }} />

            {/* Version badge */}
            <Box sx={{
              flexShrink: 0,
              background: active ? `${typeColor}22` : '#1a0000',
              border: `1px solid ${active ? typeColor + '77' : typeColor + '20'}`,
              borderRadius: '3px',
              px: '6px', py: '3px',
              minWidth: 56, textAlign: 'center', mt: '2px',
              transition: 'all 0.18s',
            }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: active ? typeColor : '#5a3030', letterSpacing: '0.1em', lineHeight: 1.6, textTransform: 'capitalize' }}>
                {fmtVersion(version)}
              </Typography>
            </Box>

            {/* Entry text */}
            <Typography sx={{
              fontFamily: MONO,
              fontSize: '15px',
              color: active ? '#f0c0c0' : '#6a4040',
              lineHeight: 1.8,
              fontStyle: 'italic',
              flex: 1,
              transition: 'color 0.18s',
            }}>
              {text}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
