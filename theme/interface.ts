export interface IColors {
  light: string
  main: string
  dark: string
  200: string
}

export interface IBackground {
  default: string
  paper: string
}

export interface IPalette {
  primary: IColors
  errors: IColors
  success: IColors
  text: IColors
  background: IBackground
}
