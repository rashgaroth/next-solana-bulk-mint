import React from 'react'

export type IDialogModal = {
  open: boolean
  handleClose: () => void
  title: string
  desc: string
  positivieButton: () => void
  negativeButton: () => void
  isError: boolean
}
