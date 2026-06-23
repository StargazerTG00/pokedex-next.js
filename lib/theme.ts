import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#cc0000',
      light: '#ff4444',
      dark: '#8b0000',
    },
    secondary: {
      main: '#f8d030',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a0000',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#f0c0c0',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          textTransform: 'uppercase',
          fontFamily: 'var(--font-press-start), var(--font-geist-mono), monospace',
          fontSize: '8px',
          letterSpacing: '0.06em',
          minWidth: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, #3d0000 0%, #1a0000 100%)',
          borderBottom: '3px solid #cc0000',
          boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
        },
      },
    },
  },
})

export default theme
