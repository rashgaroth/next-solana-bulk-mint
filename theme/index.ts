import palette from './palette'
import themeTypography from './typography'
import { ThemeOptions, createTheme } from '@mui/material/styles'
import componentStyleOverrides from './overrides'

export const theme = () => {
  const themeOptions = {
    direction: 'ltr',
    palette: palette,
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(palette)
  } as unknown as ThemeOptions
  const themes = createTheme(themeOptions)
  themes.components = componentStyleOverrides(palette)

  return themes
}

export default theme
