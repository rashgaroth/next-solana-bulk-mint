/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { IBackdrop } from 'interfaces/IBackdrop'

export default function LoadingBackdrop({ open, handleClose }: IBackdrop) {
  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
