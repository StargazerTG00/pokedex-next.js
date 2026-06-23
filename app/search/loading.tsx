import Box from '@mui/material/Box'

const pulse = {
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 0.6 } },
}

export default function Loading() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #0a0000 40%, #000000 100%)', px: { xs: 2, sm: 4, md: 6 }, py: 5 }}>
      {/* header skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mb: 5 }}>
        <Box sx={{ width: 80, height: 10, borderRadius: 1, background: '#2a0000', ...pulse }} />
        <Box sx={{ width: 200, height: 18, borderRadius: 1, background: '#2a0000', ...pulse }} />
        <Box sx={{ width: 300, height: 2, borderRadius: 1, background: '#2a0000', ...pulse }} />
      </Box>
      {/* search bar skeleton */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ height: 52, borderRadius: '6px', background: '#120000', border: '1.5px solid #1e0000', ...pulse }} />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Box sx={{ width: 130, height: 40, borderRadius: '4px', background: '#120000', ...pulse }} />
          <Box sx={{ width: 130, height: 40, borderRadius: '4px', background: '#120000', ...pulse }} />
        </Box>
      </Box>
      {/* grid skeleton */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', md: 'repeat(4,1fr)', lg: 'repeat(5,1fr)', xl: 'repeat(6,1fr)' }, gap: 2 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <Box key={i} sx={{ height: 160, borderRadius: '6px', background: '#120000', border: '1.5px solid #1e0000', ...pulse }} />
        ))}
      </Box>
    </Box>
  )
}
