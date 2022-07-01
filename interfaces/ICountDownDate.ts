import { CountdownRenderProps } from 'react-countdown'

export interface ICountDownDate extends CountdownRenderProps {
  days: number
  hours: number
  minutes: number
  seconds: number
}
