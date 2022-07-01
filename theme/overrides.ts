import { IPalette } from './interface'

export default function componentStyleOverrides(theme: IPalette) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          borderRadius: '8px',
          p: 4,
          '&:hover': {
            backgroundColor: theme.text[200],
            color: theme.background.default
          },
          backgroundColor: theme.background.default,
          color: theme.text.dark,
          letterSpacing: 1
        }
      }
    }
  }
}
