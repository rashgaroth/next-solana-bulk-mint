import React from 'react'

export type IModalProvider = {
  children: React.FC
}

export type IModalContext = {
  showDialog: boolean
  closeDialog: () => void
  openDialog: () => void
  desc: string
  title: string
  init: (desc, title, isError) => void
  errorDialog: boolean
}
