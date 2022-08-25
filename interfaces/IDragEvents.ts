import { MouseEvent } from 'react'

export interface IDragEvent<T = Element> extends MouseEvent<T, any> {
  dataTransfer: DataTransfer
}
