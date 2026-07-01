'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, TouchSensor, useSensor, useSensors, closestCenter,
} from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Team, TeamMember, PokemonSprite,
  fetchPokemonSprite, updateTeam, updateMember, removeMember,
} from '@/lib/teams-api'
import { TYPE_COLORS } from '@/lib/type-colors'

const PIXEL = 'var(--font-press-start), var(--font-geist-mono), monospace'
const MONO  = 'var(--font-geist-mono), monospace'

// ── Icons ────────────────────────────────────────────────────────────────────

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
      <circle cx="9"  cy="5"  r="1.5" /><circle cx="15" cy="5"  r="1.5" />
      <circle cx="9"  cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
      <circle cx="9"  cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
    </svg>
  )
}

// ── Sprite cache ──────────────────────────────────────────────────────────────
const spriteCache = new Map<number, PokemonSprite>()

// ── Sortable slot ─────────────────────────────────────────────────────────────

function SortableSlot({
  slotId, position, member, token,
  onAdd, onRemoved, onMemberUpdated, isDragging,
}: {
  slotId:          string
  position:        number
  member:          TeamMember | null
  token:           string
  onAdd:           (position: number) => void
  onRemoved:       (memberId: number) => void
  onMemberUpdated: (m: TeamMember) => void
  isDragging:      boolean  // this specific slot is the active drag source
}) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSortableDragging,
  } = useSortable({
    id: slotId,
    disabled: !member,  // empty slots can't be dragged
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.25 : 1,
    zIndex: isSortableDragging ? 10 : undefined,
  }

  // ── Sprite load ──
  const [sprite,        setSprite]        = useState<PokemonSprite | null>(null)
  const [loadingSprite, setLoadingSprite] = useState(false)
  const [editNick,      setEditNick]      = useState(false)
  const [nickVal,       setNickVal]       = useState(member?.nickname ?? '')
  const [savingNick,    setSavingNick]    = useState(false)
  const [removing,      setRemoving]      = useState(false)
  const nickInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!member) { setSprite(null); return }
    const cached = spriteCache.get(member.pokemon)
    if (cached) { setSprite(cached); return }
    setLoadingSprite(true)
    fetchPokemonSprite(member.pokemon)
      .then(s => { spriteCache.set(member.pokemon, s); setSprite(s) })
      .finally(() => setLoadingSprite(false))
  }, [member?.pokemon])

  useEffect(() => {
    if (editNick) nickInputRef.current?.focus()
  }, [editNick])

  const saveNick = async () => {
    if (!member || nickVal.trim() === member.nickname) { setEditNick(false); return }
    setSavingNick(true)
    try {
      const updated = await updateMember(token, member.id, { nickname: nickVal.trim() })
      onMemberUpdated(updated)
    } catch { /* keep old */ }
    setSavingNick(false)
    setEditNick(false)
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!member) return
    setRemoving(true)
    try {
      await removeMember(token, member.id)
      onRemoved(member.id)
    } catch { setRemoving(false) }
  }

  const primary = sprite?.types[0]
  const ts = primary ? (TYPE_COLORS[primary] ?? TYPE_COLORS.normal) : null

  // ── Empty slot ──
  if (!member) {
    return (
      <div ref={setNodeRef} style={style}>
        <Tooltip title={`Add Pokémon to slot ${position}`} placement="top">
          <Box
            onClick={() => onAdd(position)}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 0.75, height: 130, borderRadius: '6px', cursor: 'pointer',
              border: '1.5px dashed #2a0000',
              background: isDragging ? '#0d0000' : 'transparent',
              borderColor: isDragging ? '#cc0000' : undefined,
              transition: 'all 0.18s',
              '&:hover': { borderColor: '#cc0000', background: '#0d0000', '& svg': { color: '#cc0000' } },
            }}
          >
            <Box sx={{ color: '#3d0000', transition: 'color 0.18s' }}>
              <PlusIcon />
            </Box>
            <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: '#3d0000', letterSpacing: '0.1em' }}>
              SLOT {position}
            </Typography>
          </Box>
        </Tooltip>
      </div>
    )
  }

  // ── Filled slot ──
  return (
    <div ref={setNodeRef} style={style}>
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          height: 130, borderRadius: '6px', overflow: 'hidden',
          background: ts ? `linear-gradient(160deg, #140000 0%, ${ts.bg} 100%)` : '#120000',
          border: `1.5px solid ${ts ? ts.border + '55' : '#2a0000'}`,
          transition: 'border-color 0.18s, box-shadow 0.18s',
          position: 'relative',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          '&:hover': { border: `1.5px solid ${ts ? ts.border : '#cc0000'}` },
          '&:hover .slot-actions': { opacity: 1 },
          '&:hover .drag-hint': { opacity: 1 },
        }}
      >
        {/* Drag hint icon — top-left, appears on hover */}
        <Box
          className="drag-hint"
          sx={{
            position: 'absolute', top: 4, left: 5, zIndex: 3,
            opacity: 0, transition: 'opacity 0.15s',
            color: '#5a3030', lineHeight: 0, pointerEvents: 'none',
          }}
        >
          <DragHandleIcon />
        </Box>

        {/* Remove button — top-right, appears on hover */}
        <Box
          className="slot-actions"
          onClick={handleRemove}
          sx={{
            position: 'absolute', top: 4, right: 4, zIndex: 3,
            opacity: 0, transition: 'opacity 0.15s',
            color: '#f06060', cursor: 'pointer', lineHeight: 0,
            '&:hover': { color: '#ff3333' },
          }}
        >
          {removing ? <CircularProgress size={10} sx={{ color: '#f06060' }} /> : <TrashIcon />}
        </Box>

        {/* Sprite */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 1 }}>
          {loadingSprite ? (
            <CircularProgress size={24} sx={{ color: '#cc0000' }} />
          ) : sprite ? (
            <Box
              component={Link}
              href={`/search/${sprite.id}`}
              onClick={e => e.stopPropagation()}
              sx={{ lineHeight: 0 }}
            >
              <Box
                component="img"
                src={sprite.animatedSprite ?? sprite.sprite}
                alt={sprite.name}
                loading="lazy"
                sx={{
                  width: 60, height: 60, imageRendering: 'pixelated',
                  filter: ts ? `drop-shadow(0 2px 6px ${ts.border}99)` : undefined,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.15)' },
                }}
              />
            </Box>
          ) : null}
        </Box>

        {/* Nickname + edit */}
        <Box sx={{ width: '100%', px: 0.75, pb: 1, textAlign: 'center' }}>
          {editNick ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                component="input"
                ref={nickInputRef}
                value={nickVal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickVal(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') saveNick()
                  if (e.key === 'Escape') setEditNick(false)
                }}
                maxLength={24}
                sx={{
                  flex: 1, minWidth: 0,
                  fontFamily: MONO, fontSize: '10px', color: '#f0f0f0',
                  background: '#0d0000', border: '1px solid #cc0000',
                  borderRadius: '3px', px: '4px', py: '2px', outline: 'none',
                }}
              />
              <Box onClick={saveNick} sx={{ color: '#44dd44', cursor: 'pointer', lineHeight: 0, flexShrink: 0 }}>
                {savingNick ? <CircularProgress size={10} sx={{ color: '#44dd44' }} /> : <CheckIcon />}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); setNickVal(member.nickname); setEditNick(true) }}
            >
              <Typography sx={{
                fontFamily: PIXEL, fontSize: '7px', color: '#f0c0c0',
                letterSpacing: '0.06em', textTransform: 'capitalize',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 72,
              }}>
                {member.nickname || (sprite?.name ?? `#${member.pokemon}`)}
              </Typography>
              <Box sx={{ color: '#5a3030', flexShrink: 0, lineHeight: 0 }}><EditIcon /></Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

// ── Drag overlay preview ──────────────────────────────────────────────────────

function SlotOverlay({ member }: { member: TeamMember }) {
  const sprite = spriteCache.get(member.pokemon)
  const ts = sprite?.types[0] ? (TYPE_COLORS[sprite.types[0]] ?? TYPE_COLORS.normal) : null

  return (
    <Box sx={{
      width: '100%', height: 130, borderRadius: '6px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: ts ? `linear-gradient(160deg, #140000 0%, ${ts.bg} 100%)` : '#120000',
      border: `1.5px solid ${ts ? ts.border : '#cc0000'}`,
      boxShadow: ts ? `0 0 24px ${ts.border}88, 0 12px 32px rgba(0,0,0,0.9)` : '0 12px 32px rgba(0,0,0,0.9)',
      cursor: 'grabbing',
      opacity: 0.92,
      transform: 'scale(1.05) rotate(2deg)',
    }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 1 }}>
        {sprite && (
          <Box
            component="img"
            src={sprite.animatedSprite ?? sprite.sprite}
            alt={sprite.name}
            sx={{ width: 60, height: 60, imageRendering: 'pixelated', filter: ts ? `drop-shadow(0 2px 8px ${ts.border}cc)` : undefined }}
          />
        )}
      </Box>
      <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: '#f0c0c0', pb: 1, letterSpacing: '0.06em', textTransform: 'capitalize' }}>
        {member.nickname || sprite?.name || `#${member.pokemon}`}
      </Typography>
    </Box>
  )
}

// ── TeamCard ──────────────────────────────────────────────────────────────────

type Props = {
  team:          Team
  token:         string
  onPickPokemon: (teamId: number, position: number) => void
  onTeamUpdated: (t: Team) => void
  onTeamDeleted: (id: number) => void
}

export default function TeamCard({ team, token, onPickPokemon, onTeamUpdated, onTeamDeleted }: Props) {
  const [editName,    setEditName]    = useState(false)
  const [nameVal,     setNameVal]     = useState(team.name)
  const [savingName,  setSavingName]  = useState(false)
  const [togglingFav, setTogglingFav] = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [confirmDel,  setConfirmDel]  = useState(false)
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editName) nameInputRef.current?.focus() }, [editName])

  // Keep local member list in sync with parent (needed for optimistic drag updates)
  const [localMembers, setLocalMembers] = useState<TeamMember[]>(team.members)
  useEffect(() => { setLocalMembers(team.members) }, [team.members])

  // Build slot IDs: member ID (as string) for filled, 'empty-N' for empty
  const slots = Array.from({ length: 6 }, (_, i) => {
    const pos = i + 1
    return localMembers.find(m => m.position === pos) ?? null
  })
  const slotIds = slots.map((m, i) => m ? String(m.id) : `empty-${i + 1}`)

  // dnd-kit sensors: pointer with 5px move threshold so clicks still work
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    const member = localMembers.find(m => String(m.id) === String(active.id))
    setActiveMember(member ?? null)
  }

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveMember(null)
    if (!over || active.id === over.id) return

    const activeIdx = slotIds.indexOf(String(active.id))
    const overIdx   = slotIds.indexOf(String(over.id))
    if (activeIdx === -1 || overIdx === -1) return

    const fromPos = activeIdx + 1
    const toPos   = overIdx + 1

    const movedMember = localMembers.find(m => m.position === fromPos)
    if (!movedMember) return
    const swapMember = localMembers.find(m => m.position === toPos)

    // Optimistic update
    const newMembers = localMembers.map(m => {
      if (m.id === movedMember.id) return { ...m, position: toPos }
      if (swapMember && m.id === swapMember.id) return { ...m, position: fromPos }
      return m
    })
    setLocalMembers(newMembers)
    onTeamUpdated({ ...team, members: newMembers })

    // Persist to backend
    try {
      await updateMember(token, movedMember.id, { position: toPos })
      if (swapMember) await updateMember(token, swapMember.id, { position: fromPos })
    } catch {
      // Revert on error
      setLocalMembers(team.members)
      onTeamUpdated({ ...team, members: team.members })
    }
  }

  // ── Team-level actions ────────────────────────────────────────────────────

  const saveName = async () => {
    if (nameVal.trim() === team.name) { setEditName(false); return }
    setSavingName(true)
    try {
      const updated = await updateTeam(token, team.id, { name: nameVal.trim() })
      onTeamUpdated({ ...updated, members: localMembers })
    } catch { setNameVal(team.name) }
    setSavingName(false)
    setEditName(false)
  }

  const toggleFavorite = async () => {
    setTogglingFav(true)
    try {
      const updated = await updateTeam(token, team.id, { favorite: !team.favorite })
      onTeamUpdated({ ...updated, members: localMembers })
    } catch { /* noop */ }
    setTogglingFav(false)
  }

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    try {
      const { deleteTeam } = await import('@/lib/teams-api')
      await deleteTeam(token, team.id)
      onTeamDeleted(team.id)
    } catch { setDeleting(false); setConfirmDel(false) }
  }

  const memberCount  = localMembers.length
  const createdDate  = new Date(team.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Box
      sx={{
        background: 'linear-gradient(170deg, #1e0000 0%, #120000 100%)',
        border: `2px solid ${team.favorite ? '#a0700044' : '#2a0000'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: team.favorite
          ? '0 0 20px rgba(248,208,48,0.08), 0 8px 32px rgba(0,0,0,0.8)'
          : '0 8px 32px rgba(0,0,0,0.7)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Top strip */}
      <Box sx={{
        height: '3px',
        background: team.favorite
          ? 'linear-gradient(90deg, transparent, #a07000, #f8d030, #a07000, transparent)'
          : 'linear-gradient(90deg, transparent, #3d0000, transparent)',
      }} />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5, pt: 2, pb: 1.5 }}>
        <Box
          onClick={toggleFavorite}
          sx={{ color: team.favorite ? '#f8d030' : '#3d0000', cursor: 'pointer', lineHeight: 0, flexShrink: 0, transition: 'color 0.15s, transform 0.15s', '&:hover': { color: '#f8d030', transform: 'scale(1.2)' } }}
        >
          {togglingFav ? <CircularProgress size={14} sx={{ color: '#f8d030' }} /> : <StarIcon filled={team.favorite} />}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {editName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                component="input"
                ref={nameInputRef}
                value={nameVal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameVal(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditName(false) }}
                maxLength={40}
                sx={{ flex: 1, minWidth: 0, fontFamily: PIXEL, fontSize: '11px', color: '#f8d030', background: '#0d0000', border: '1.5px solid #cc0000', borderRadius: '4px', px: '8px', py: '4px', outline: 'none', letterSpacing: '0.06em' }}
              />
              <Box onClick={saveName} sx={{ color: '#44dd44', cursor: 'pointer', lineHeight: 0, flexShrink: 0 }}>
                {savingName ? <CircularProgress size={12} sx={{ color: '#44dd44' }} /> : <CheckIcon />}
              </Box>
            </Box>
          ) : (
            <Box onClick={() => { setNameVal(team.name); setEditName(true) }} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer', '&:hover .edit-icon': { opacity: 1 } }}>
              <Typography sx={{ fontFamily: PIXEL, fontSize: '12px', color: '#f8d030', letterSpacing: '0.08em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: team.favorite ? '0 0 10px rgba(248,208,48,0.5)' : 'none' }}>
                {team.name}
              </Typography>
              <Box className="edit-icon" sx={{ color: '#5a3030', opacity: 0, transition: 'opacity 0.15s', lineHeight: 0 }}>
                <EditIcon />
              </Box>
            </Box>
          )}
        </Box>

        <Box onClick={handleDelete} sx={{ color: confirmDel ? '#ff4444' : '#3d1010', cursor: 'pointer', lineHeight: 0, flexShrink: 0, transition: 'color 0.15s', '&:hover': { color: '#ff4444' } }}>
          {deleting ? <CircularProgress size={13} sx={{ color: '#ff4444' }} /> : <TrashIcon />}
        </Box>
      </Box>

      {/* Meta row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2.5, pb: 2, flexWrap: 'wrap' }}>
        <Typography sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#5a3030', letterSpacing: '0.1em' }}>
          {memberCount}/6 MEMBERS
        </Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: '11px', color: '#3d1010' }}>
          {createdDate}
        </Typography>
        {memberCount > 1 && (
          <Typography sx={{ fontFamily: PIXEL, fontSize: '7px', color: '#2a1010', letterSpacing: '0.08em' }}>
            DRAG TO REORDER
          </Typography>
        )}
        {confirmDel && (
          <Typography onClick={() => setConfirmDel(false)} sx={{ fontFamily: PIXEL, fontSize: '8px', color: '#ff4444', letterSpacing: '0.06em', cursor: 'pointer', ml: 'auto' }}>
            CLICK ✕ AGAIN TO DELETE
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 2.5, height: '1px', background: 'linear-gradient(90deg, transparent, #2a0000, transparent)', mb: 2 }} />

      {/* 6-slot sortable grid */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={slotIds} strategy={rectSortingStrategy}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
              '@media (min-width:480px)': { gridTemplateColumns: 'repeat(6, 1fr)' },
            }}>
              {slots.map((member, i) => (
                <SortableSlot
                  key={slotIds[i]}
                  slotId={slotIds[i]}
                  position={i + 1}
                  member={member}
                  token={token}
                  isDragging={!!activeMember}
                  onAdd={onPickPokemon.bind(null, team.id)}
                  onRemoved={(memberId) => {
                    const next = localMembers.filter(m => m.id !== memberId)
                    setLocalMembers(next)
                    onTeamUpdated({ ...team, members: next })
                  }}
                  onMemberUpdated={(updated) => {
                    const next = localMembers.map(m => m.id === updated.id ? updated : m)
                    setLocalMembers(next)
                    onTeamUpdated({ ...team, members: next })
                  }}
                />
              ))}
            </Box>
          </SortableContext>

          <DragOverlay>
            {activeMember ? <SlotOverlay member={activeMember} /> : null}
          </DragOverlay>
        </DndContext>
      </Box>

      {/* Bottom strip */}
      <Box sx={{ height: '2px', background: 'linear-gradient(90deg, transparent, #2a0000, transparent)' }} />
    </Box>
  )
}
