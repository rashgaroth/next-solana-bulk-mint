/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */
import { IPalette } from './interface'

export default function themeTypography(theme: IPalette) {
  return {
    fontFamily: `'Poppins', sans-serif`,
    h6: {
      fontWeight: 500,
      color: theme.text.main,
      fontSize: '0.75rem'
    },
    h5: {
      fontSize: '0.875rem',
      color: theme.text.main,
      fontWeight: 'bold'
    },
    h4: {
      fontSize: '1rem',
      color: theme.text.main,
      fontWeight: 600
    },
    h3: {
      fontSize: '1.25rem',
      color: theme.text.main,
      fontWeight: 600
    },
    h2: {
      fontSize: '1.5rem',
      color: theme.text.main,
      fontWeight: 700
    },
    h1: {
      fontSize: '2rem',
      color: theme.text.main,
      fontWeight: 'bold'
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.text.dark
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: theme.text
    },
    caption: {
      fontSize: '0.75rem',
      color: theme.text,
      fontWeight: 400
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.334em'
    },
    body2: {
      letterSpacing: '0em',
      fontWeight: 400,
      lineHeight: '1.5em',
      color: theme.text.dark
    },
    button: {
      textTransform: 'capitalize',
      fontWeight: 'bold'
    },
    customInput: {
      marginTop: 1,
      marginBottom: 1,
      '& > label': {
        top: 23,
        left: 0,
        color: theme.text,
        '&[data-shrink="false"]': {
          top: 5
        }
      },
      '& > div > input': {
        padding: '30.5px 14px 11.5px !important'
      },
      '& legend': {
        display: 'none'
      },
      '& fieldset': {
        top: 0
      }
    },
    mainContent: {
      backgroundColor: theme.background,
      width: '100%',
      minHeight: 'calc(100vh - 88px)',
      flexGrow: 1,
      padding: '20px',
      marginTop: '88px',
      marginRight: '20px',
      borderRadius: `${8}px`
    },
    menuCaption: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.text.main,
      padding: '6px',
      textTransform: 'capitalize',
      marginTop: '10px'
    },
    subMenuCaption: {
      fontSize: '0.6875rem',
      fontWeight: 500,
      color: theme.text,
      textTransform: 'capitalize'
    },
    commonAvatar: {
      cursor: 'pointer',
      borderRadius: '8px'
    },
    smallAvatar: {
      width: '22px',
      height: '22px',
      fontSize: '1rem'
    },
    mediumAvatar: {
      width: '34px',
      height: '34px',
      fontSize: '1.2rem'
    },
    largeAvatar: {
      width: '44px',
      height: '44px',
      fontSize: '1.5rem'
    }
  }
}
