import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import { IDialogModal } from 'components/@types/IDialogModal'
import { Button, IconButton, Stack, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4
}

const DialogModal: React.FC<IDialogModal> = ({ open, handleClose, desc, negativeButton, positivieButton, title, isError }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}>
      <Fade in={open}>
        <Box sx={style}>
          <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
            <Typography component={'div'} variant="h2" color="white" textAlign={'center'}>
              {title}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Stack>
          <Typography component="div" variant="h4" color="white" textAlign={'center'} mt={5} mb={5}>
            {desc}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={isError ? 'center' : 'end'} spacing={2} mt={2}>
            {!isError && (
              <Button
                onClick={negativeButton}
                sx={{
                  zIndex: 1000,
                  backgroundColor: 'red',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'darkorange' },
                  color: 'white'
                }}>
                Cancel
              </Button>
            )}
            <Button
              onClick={positivieButton}
              sx={{
                zIndex: 1000,
                bgcolor: 'primary.light',
                borderRadius: 2,
                '&:hover': { backgroundColor: 'darkorange' },
                color: 'white'
              }}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  )
}

export default DialogModal
