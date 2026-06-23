import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

function CardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(160deg, #2a0000 0%, #1a0000 100%)',
        border: '2px solid #3d0000',
        borderRadius: '6px',
        overflow: 'hidden',
        p: 2,
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Skeleton variant="circular" width={140} height={140} sx={{ bgcolor: '#3d0000' }} />
      </Box>
      <Skeleton variant="rectangular" height={12} sx={{ bgcolor: '#3d0000', borderRadius: 1, mx: 'auto', width: '60%' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Skeleton variant="rectangular" width={50} height={18} sx={{ bgcolor: '#3d0000', borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={50} height={18} sx={{ bgcolor: '#3d0000', borderRadius: 1 }} />
      </Box>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={5} sx={{ bgcolor: '#3d0000', borderRadius: 1 }} />
      ))}
    </Box>
  )
}

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 50%, #000000 100%)',
        px: { xs: 2, sm: 4 },
        py: 6,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography sx={{ fontSize: '40px', lineHeight: 1, mb: 2 }}>🏆</Typography>
        <Skeleton variant="rectangular" height={20} sx={{ bgcolor: '#3d0000', borderRadius: 1, mx: 'auto', maxWidth: 320, mb: 2 }} />
        <Skeleton variant="rectangular" height={2} sx={{ bgcolor: '#3d0000', mx: 'auto', maxWidth: 400 }} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          maxWidth: '1000px',
          mx: 'auto',
        }}
      >
        {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
      </Box>
    </Box>
  )
}
