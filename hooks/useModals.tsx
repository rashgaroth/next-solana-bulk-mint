import React, { useMemo, useEffect, createContext, FC, useState } from 'react'
import { IModalContext, IModalProvider } from './@types/IModalProvider'

export const ModalsContext = createContext<IModalContext | null>(null)
export const ModalProvider: FC<any> = ({ children }) => {
  const [showDialog, setShow] = useState(false)
  const [desc, setDesc] = useState('')
  const [title, setTitle] = useState('')
  const [errorDialog, setErrorDialog] = useState(false)

  const openDialog = () => {
    setShow(true)
  }

  const closeDialog = () => {
    setShow(false)
  }

  const init = (desc, title, isError) => {
    setDesc(desc)
    setTitle(title)
    setErrorDialog(isError)
  }

  const values = useMemo(
    () =>
      ({
        showDialog,
        openDialog,
        closeDialog,
        init,
        desc,
        title,
        errorDialog
      } as IModalContext),
    [desc, errorDialog, showDialog, title]
  )

  return <ModalsContext.Provider value={values}>{children}</ModalsContext.Provider>
}
export default function useModals(): IModalContext {
  const context = React.useContext(ModalsContext)
  if (context === undefined) {
    throw new Error('useModal must be povided with ModalProvider')
  }
  return context
}
