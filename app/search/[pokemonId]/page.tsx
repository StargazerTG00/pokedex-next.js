import { notFound } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TYPE_COLORS } from '@/lib/type-colors'
import PokemonDetailClient from '@/components/pokemon-detail-client'
import PokedexEntriesClient from '@/components/pokedex-entries-client'
import AbilitiesClient from '@/components/abilities-client'
import MovesClient from '@/components/moves-client'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SPA', 'special-defense': 'SPD', speed: 'SPE',
}

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

const METHOD_LABELS: Record<string, string> = {
  'walk': 'Walking', 'surf': 'Surfing', 'old-rod': 'Old Rod',
  'good-rod': 'Good Rod', 'super-rod': 'Super Rod', 'rock-smash': 'Rock Smash',
  'headbutt': 'Headbutt', 'only-one': 'Special', 'gift': 'Gift',
  'cave-spots': 'Cave', 'dark-grass': 'Dark Grass',
  'overworld-water-special': 'Water', 'overworld-water': 'Water',
  'tall-grass': 'Tall Grass',
}

type Stat = { stat: { name: string }; base_stat: number }

type EncounterDetail = {
  chance: number
  method: { name: string }
  min_level: number
  max_level: number
}
type VersionDetail = {
  version: { name: string }
  encounter_details: EncounterDetail[]
  max_chance: number
}
type LocationEncounter = {
  location_area: { name: string }
  version_details: VersionDetail[]
}

function fmtVersion(v: string) {
  return VERSION_LABELS[v] ?? (v.charAt(0).toUpperCase() + v.slice(1))
}

function fmtLocation(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmtMethod(m: string) {
  return METHOD_LABELS[m] ?? m.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function StatBar({ name, value, typeColor }: { name: string; value: number; typeColor: string }) {
  const pct = Math.min((value / 255) * 100, 100)
  const barColor = value >= 100 ? '#f8d030' : value >= 60 ? '#cc6600' : '#cc0000'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#a06060', width: 32, textAlign: 'right', flexShrink: 0 }}>
        {STAT_LABELS[name] ?? name.slice(0, 3).toUpperCase()}
      </Typography>
      <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#f0c0c0', width: 28, flexShrink: 0 }}>
        {value}
      </Typography>
      <Box sx={{ flex: 1, height: 8, background: '#0d0000', border: `1px solid ${typeColor}33`, borderRadius: '3px', overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${barColor}66, ${barColor})`, boxShadow: `0 0 8px ${barColor}` }} />
      </Box>
      <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', width: 28, flexShrink: 0 }}>
        {pct.toFixed(0)}%
      </Typography>
    </Box>
  )
}

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, background: '#0d0000', border: '1px solid #2a0000', borderRadius: '4px', px: 1.5, py: 1 }}>
      <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#a06060', letterSpacing: '0.15em' }}>{label}</Typography>
      <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#f0c0c0' }}>{value}</Typography>
    </Box>
  )
}

export default async function PokemonDetailPage({ params }: { params: Promise<{ pokemonId: string }> }) {
  const { pokemonId } = await params

  const [pokeRes, speciesRes, encountersRes] = await Promise.allSettled([
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, { next: { revalidate: 86400 } }),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`, { next: { revalidate: 86400 } }),
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`, { next: { revalidate: 86400 } }),
  ])

  if (pokeRes.status === 'rejected' || !pokeRes.value.ok) notFound()

  const poke = await pokeRes.value.json()
  const species = speciesRes.status === 'fulfilled' && speciesRes.value.ok
    ? await speciesRes.value.json()
    : null
  const encountersRaw: LocationEncounter[] =
    encountersRes.status === 'fulfilled' && encountersRes.value.ok
      ? await encountersRes.value.json()
      : []

  const types: string[] = poke.types.map((t: { type: { name: string } }) => t.type.name)
  const primary = types[0]
  const ts = TYPE_COLORS[primary] ?? TYPE_COLORS.normal

  const artworkUrl: string =
    poke.sprites.other?.['official-artwork']?.front_default ?? poke.sprites.front_default
  const animatedSprite: string | null =
    poke.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null
  const cryUrl: string | null = poke.cries?.latest ?? null
  const legacyCryUrl: string | null = poke.cries?.legacy ?? null

  const stats: Stat[] = poke.stats
  const abilities: { name: string; hidden: boolean }[] = poke.abilities.map(
    (a: { ability: { name: string }; is_hidden: boolean }) => ({ name: a.ability.name, hidden: a.is_hidden })
  )

  type MoveDetail = { move_learn_method: { name: string }; level_learned_at: number }
  type MoveEntry  = { move: { name: string }; version_group_details: MoveDetail[] }

  const levelMoves: { name: string; level: number }[] = (poke.moves as MoveEntry[])
    .filter(m => m.version_group_details.some(d => d.move_learn_method.name === 'level-up'))
    .map(m => ({
      name: m.move.name,
      level: m.version_group_details.find(d => d.move_learn_method.name === 'level-up')?.level_learned_at ?? 0,
    }))
    .sort((a, b) => a.level - b.level)
    .slice(0, 24)

  // Unique English flavor texts — latest games first
  const seenTexts = new Set<string>()
  const flavorEntries: { version: string; text: string }[] = []
  if (species?.flavor_text_entries) {
    for (const entry of (species.flavor_text_entries as { language: { name: string }; version: { name: string }; flavor_text: string }[])) {
      if (entry.language.name !== 'en') continue
      const clean = entry.flavor_text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim()
      if (!seenTexts.has(clean)) {
        seenTexts.add(clean)
        flavorEntries.push({ version: entry.version.name, text: clean })
      }
    }
  }
  const flavorTexts = flavorEntries.slice(-6).reverse()
  const latestFlavor = flavorTexts[0]?.text ?? ''

  const genus: string = species?.genera
    ?.find((g: { language: { name: string }; genus: string }) => g.language.name === 'en')
    ?.genus ?? ''

  const totalStats = stats.reduce((s: number, st: Stat) => s + st.base_stat, 0)

  // Process encounter locations — group by location area
  type WildLocation = {
    name: string
    versions: string[]
    methods: { label: string; minLv: number; maxLv: number; chance: number }[]
  }
  const wildLocations: WildLocation[] = encountersRaw.slice(0, 16).map(enc => {
    const methodMap = new Map<string, { minLv: number; maxLv: number; chance: number }>()
    const versions: string[] = []
    for (const vd of enc.version_details) {
      versions.push(vd.version.name)
      for (const detail of vd.encounter_details) {
        const key = detail.method.name
        const cur = methodMap.get(key)
        if (!cur) {
          methodMap.set(key, { minLv: detail.min_level, maxLv: detail.max_level, chance: detail.chance })
        } else {
          methodMap.set(key, {
            minLv: Math.min(cur.minLv, detail.min_level),
            maxLv: Math.max(cur.maxLv, detail.max_level),
            chance: Math.max(cur.chance, detail.chance),
          })
        }
      }
    }
    const uniqueVersions = Array.from(new Set(versions)).slice(0, 6)
    const methods = Array.from(methodMap.entries()).map(([m, info]) => ({ label: fmtMethod(m), ...info }))
    return { name: fmtLocation(enc.location_area.name), versions: uniqueVersions, methods }
  })

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 50% 0%, ${ts.border}22 0%, #0a0000 40%, #000000 100%)`,
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
      }}
    >
      {/* Back nav */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
        <Link href="/search" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontFamily: PIXEL, fontSize: '11px', color: '#a06060', letterSpacing: '0.1em', cursor: 'pointer', '&:hover': { color: '#f0c0c0' }, transition: 'color 0.15s' }}>
            ← BACK TO SEARCH
          </Box>
        </Link>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>

        {/* ── Left panel ── */}
        <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 340 } }}>
          <Box
            sx={{
              background: `linear-gradient(170deg, #1e0000 0%, #120000 50%, ${ts.bg} 100%)`,
              border: `2px solid ${ts.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: `0 0 30px ${ts.border}33, 0 12px 40px rgba(0,0,0,0.9)`,
            }}
          >
            <Box sx={{ height: '3px', background: `linear-gradient(90deg, transparent, ${ts.border}, transparent)`, boxShadow: `0 0 8px ${ts.border}` }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pt: 1.5 }}>
              <Box sx={{ background: 'linear-gradient(135deg, #f8d030, #c48a00)', border: '1.5px solid #a07000', borderRadius: '3px', px: '7px', py: '3px', boxShadow: '0 0 10px rgba(248,208,48,0.6)' }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#1a0000', lineHeight: 1 }}>
                  No.{String(poke.id).padStart(3, '0')}
                </Typography>
              </Box>
              {genus && (
                <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: ts.border, opacity: 0.7, alignSelf: 'center' }}>
                  {genus.toUpperCase()}
                </Typography>
              )}
            </Box>

            <PokemonDetailClient
              artworkUrl={artworkUrl}
              animatedSprite={animatedSprite}
              cryUrl={cryUrl}
              legacyCryUrl={legacyCryUrl}
              name={poke.name}
              typeColor={ts.border}
            />

            <Box sx={{ textAlign: 'center', px: 2, pb: 1 }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', textShadow: `0 0 14px rgba(248,208,48,0.7), 0 0 30px ${ts.border}44`, letterSpacing: '0.1em', textTransform: 'capitalize' }}>
                {poke.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, pb: 2 }}>
              {types.map((t: string) => {
                const tc = TYPE_COLORS[t] ?? TYPE_COLORS.normal
                return (
                  <Box key={t} sx={{ background: tc.bg, border: `1.5px solid ${tc.border}`, borderRadius: '3px', px: '10px', py: '4px', boxShadow: `0 0 8px ${tc.border}44` }}>
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: tc.text, letterSpacing: '0.1em' }}>
                      {t.toUpperCase()}
                    </Typography>
                  </Box>
                )
              })}
            </Box>

            {latestFlavor && (
              <Box sx={{ mx: 2, mb: 2, background: '#0d0000', border: `1px solid ${ts.border}22`, borderRadius: '4px', p: 1.5 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: '15px', color: '#c8a0a0', lineHeight: 1.8, fontStyle: 'italic' }}>
                  &ldquo;{latestFlavor}&rdquo;
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1, px: 2, pb: 2 }}>
              <DataPill label="HEIGHT"   value={`${(poke.height / 10).toFixed(1)} m`} />
              <DataPill label="WEIGHT"   value={`${(poke.weight / 10).toFixed(1)} kg`} />
              <DataPill label="BASE EXP" value={String(poke.base_experience ?? '—')} />
              <DataPill label="CAPTURE"  value={`${species?.capture_rate ?? '—'}`} />
            </Box>

            <Box sx={{ height: '3px', background: `linear-gradient(90deg, transparent, ${ts.border}88, transparent)` }} />
          </Box>
        </Box>

        {/* ── Right panel ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Pokédex Entries */}
          {flavorTexts.length > 0 && (
            <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em', mb: 2 }}>
                POKÉDEX ENTRIES
              </Typography>
              <PokedexEntriesClient entries={flavorTexts} typeColor={ts.border} />
            </Box>
          )}

          {/* Base Stats */}
          <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em' }}>BASE STATS</Typography>
              <Box sx={{ background: `${ts.border}22`, border: `1px solid ${ts.border}`, borderRadius: '3px', px: 1.5, py: 0.5 }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: ts.text }}>
                  TOTAL {totalStats}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {stats.map((s: Stat) => (
                <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} typeColor={ts.border} />
              ))}
            </Box>
          </Box>

          {/* Abilities */}
          <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em', mb: 2 }}>ABILITIES</Typography>
            <AbilitiesClient abilities={abilities} typeColor={ts.border} />
          </Box>

          {/* Wild Locations */}
          <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em' }}>
                WILD LOCATIONS
              </Typography>
              {wildLocations.length > 0 && (
                <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.1em' }}>
                  {encountersRaw.length} AREA{encountersRaw.length !== 1 ? 'S' : ''}
                </Typography>
              )}
            </Box>

            {wildLocations.length === 0 ? (
              <Box sx={{ background: '#0d0000', border: '1px solid #2a0000', borderRadius: '4px', p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: '#5a3030', letterSpacing: '0.08em', mb: 0.75 }}>
                  NOT FOUND IN THE WILD
                </Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: '15px', color: '#5a3030', lineHeight: 1.7 }}>
                  Obtain via trade, evolution, or in-game gift.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)' }, gap: 1.5 }}>
                {wildLocations.map((loc, i) => (
                  <Box
                    key={i}
                    sx={{
                      background: '#0a0000',
                      border: `1px solid ${ts.border}22`,
                      borderRadius: '5px',
                      p: 1.25,
                      transition: 'border-color 0.15s',
                      '&:hover': { borderColor: `${ts.border}55` },
                    }}
                  >
                    <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#f0c0c0', letterSpacing: '0.06em', mb: 0.75, lineHeight: 1.5 }}>
                      {loc.name}
                    </Typography>

                    {/* Method + level */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.75 }}>
                      {loc.methods.map((m, mi) => (
                        <Box key={mi} sx={{ background: `${ts.border}14`, border: `1px solid ${ts.border}33`, borderRadius: '3px', px: '5px', py: '2px' }}>
                          <Typography sx={{ fontFamily: PIXEL, fontSize: '11px', color: ts.border, letterSpacing: '0.08em' }}>
                            {m.label} · Lv {m.minLv === m.maxLv ? m.minLv : `${m.minLv}–${m.maxLv}`}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Game versions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                      {loc.versions.map((v, vi) => (
                        <Typography key={vi} sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.08em', textTransform: 'capitalize' }}>
                          {fmtVersion(v)}{vi < loc.versions.length - 1 ? ' ·' : ''}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Species info */}
          {species && (
            <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em', mb: 2 }}>INFO</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <DataPill label="GROWTH RATE"  value={species.growth_rate?.name?.replace(/-/g, ' ').toUpperCase() ?? '—'} />
                <DataPill label="EGG GROUPS"   value={species.egg_groups?.map((e: { name: string }) => e.name).join(', ').toUpperCase() ?? '—'} />
                <DataPill label="HAPPINESS"    value={String(species.base_happiness ?? '—')} />
                <DataPill label="HATCH STEPS"  value={species.hatch_counter ? String((species.hatch_counter + 1) * 255) : '—'} />
                {species.is_legendary && <DataPill label="STATUS" value="LEGENDARY ★" />}
                {species.is_mythical  && <DataPill label="STATUS" value="MYTHICAL ★★" />}
              </Box>
            </Box>
          )}

          {/* Level-up moves */}
          {levelMoves.length > 0 && (
            <Box sx={{ background: 'linear-gradient(160deg, #1e0000 0%, #120000 100%)', border: `1px solid ${ts.border}44`, borderRadius: '8px', p: { xs: 2, sm: 3 }, boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '15px', color: '#f8d030', letterSpacing: '0.1em' }}>
                  LEVEL-UP MOVES
                </Typography>
                <Typography sx={{ fontFamily: PIXEL, fontSize: '9px', color: '#5a3030', letterSpacing: '0.1em' }}>
                  {levelMoves.length} MOVES · CLICK FOR DETAILS
                </Typography>
              </Box>
              <MovesClient moves={levelMoves} typeColor={ts.border} />
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  )
}
