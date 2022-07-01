import { IPalette } from './interface'

const palette = <IPalette>{
  primary: {
    light: '#FBA722',
    main: '#FFAA5B',
    dark: '#FFB28A',
    200: '#FFC0B7'
  },
  errors: {
    light: '#F44336',
    main: '#FF6973',
    dark: '#FF92AC',
    200: '#FFBCE2'
  },
  success: {
    light: '#b9f6ca',
    main: '#69f0ae',
    dark: '#00e676',
    200: '#00c853'
  },
  text: {
    light: '#000000',
    main: '#303030',
    dark: '#5E5E5E',
    200: '#919191'
  },
  background: {
    default: '#FFF',
    paper: '#FFC0B7'
  }
}

export default palette
