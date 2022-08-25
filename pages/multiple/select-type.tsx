/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import AuthLayout from 'layouts/AuthLayout'
import { Box } from '@mui/system'
import { Alert, Backdrop, Button, Divider, Fade, Grid, IconButton, Modal, Snackbar, Stack, Typography } from '@mui/material'
import { CheckSharp, Close, Create, DataObject, NavigateNext, PublishedWithChanges, SelectAll } from '@mui/icons-material'
import { AlertState } from 'lib/utils'
import { IDragEvent } from 'interfaces/IDragEvents'
import BreadCrumb from 'components/Breadchumb'
import { LoadingButton } from '@mui/lab'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  mintWidth: 400,
  bgcolor: 'background.default',
  boxShadow: 24,
  p: 2,
  borderRadius: 2
}

const JsonUploader = ({ onDoneUpload }) => {
  const [isJSONDrag, setIsJSONDrag] = React.useState(false)
  const [json, setJson] = React.useState<File>(null)
  const [isJSONUploaded, setIsJSONUploaded] = React.useState(false)
  const [configUploadLoading, setConfigUploadLoading] = React.useState(false)
  const [isJsonCacheStored, setIsJsonCacheStored] = React.useState(false)

  const [isJSONConfigDrag, setIsJSONConfigDrag] = React.useState(false)
  const [jsonConfig, setJsonConfig] = React.useState<File>(null)
  const [isJSONConfigUploaded, setIsJSONConfigUploaded] = React.useState(false)
  const [configCMUploadLoading, setConfigCMUploadLoading] = React.useState(false)
  const [isJsonConfigStored, setIsJsonConfigStored] = React.useState(false)

  const [doneLoader, setDoneLoader] = React.useState(false)

  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })

  const inputJSONRef = React.useRef<HTMLInputElement>(null)
  const inputJSONConfigRef = React.useRef<HTMLInputElement>(null)
  const wallet = useWallet()
  const router = useRouter()

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>, isJson = false) => {
    const file = e.target.files[0]
    if (file.type === 'application/json' && isJson) {
      setJson(file)
      setIsJSONUploaded(true)
    } else {
      setJsonConfig(file)
      setIsJSONConfigUploaded(true)
    }
  }

  const dragFile = (e: React.DragEvent<HTMLSpanElement>, isJson = false) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (isJson) {
        setIsJSONDrag(true)
      } else {
        setIsJSONConfigDrag(true)
      }
    } else if (e.type === 'dragleave') {
      if (isJson) {
        setIsJSONDrag(false)
      } else {
        setIsJSONConfigDrag(false)
      }
    }
  }

  const handleDrop = (e: IDragEvent<HTMLDivElement>, isJson = false) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (isJson) {
        if (file.type === 'application/json') {
          setJson(e.dataTransfer.files[0])
          setIsJSONUploaded(true)
          setIsJSONDrag(false)
        }
      } else {
        if (file.type === 'application/json') {
          setJsonConfig(e.dataTransfer.files[0])
          setIsJSONConfigUploaded(true)
          setIsJSONConfigDrag(false)
          return
        }
      }
      if (file.type !== 'application/json') {
        setAlertState({
          message: 'File must be JSON format',
          open: true,
          severity: 'error'
        })
        setIsJSONUploaded(false)
        return
      }
    }
  }

  const uploadCacheJSON = async () => {
    try {
      const formData = new FormData()
      formData.append('file', json)
      setConfigUploadLoading(true)
      const addr = wallet.publicKey.toBase58()
      const uploadCache = await fetch(`/api/whitelist/files/upload?address=${addr}&type=file&config=cache`, {
        method: 'POST',
        body: formData
      })
      if (uploadCache.status === 200) {
        const jsonUpload = await uploadCache.json()
        if (jsonUpload.uploaded) {
          setIsJsonCacheStored(true)
          setAlertState({
            message: 'Success Upload',
            open: true,
            severity: 'success'
          })
        }
      } else {
        setAlertState({
          message: 'Network Error',
          open: true,
          severity: 'error'
        })
      }
      setConfigUploadLoading(false)
    } catch (error) {
      setConfigUploadLoading(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  const uploadConfigJSON = async () => {
    try {
      const formData = new FormData()
      formData.append('file', jsonConfig)
      setConfigCMUploadLoading(true)
      const addr = wallet.publicKey.toBase58()
      const uploadCache = await fetch(`/api/whitelist/files/upload?address=${addr}&type=file&config=cm`, {
        method: 'POST',
        body: formData
      })
      if (uploadCache.status === 200) {
        const jsonUpload = await uploadCache.json()
        if (jsonUpload.uploaded) {
          setIsJsonConfigStored(true)
          setAlertState({
            message: 'Success Upload',
            open: true,
            severity: 'success'
          })
        }
      } else {
        setAlertState({
          message: 'Network Error',
          open: true,
          severity: 'error'
        })
      }
      setConfigCMUploadLoading(false)
    } catch (error) {
      setConfigCMUploadLoading(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 4, p: 2 }}>
      <BreadCrumb child="UploadConfig" parent="mint" />
      <h2 style={{ color: '#303030' }}>Upload your cache 🍬</h2>
      <Grid container direction="column" spacing={1}>
        <Grid item width={'100%'} sx={{ height: 'auto' }}>
          <Stack direction={'row'} spacing={2} alignItems="center">
            <Box
              component="div"
              sx={{
                p: 2,
                border: '1px dashed grey',
                height: 100,
                width: 300,
                borderRadius: 4,
                bgcolor: isJSONDrag ? 'primary.light' : 'white'
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              onDragEnter={(e) => dragFile(e, true)}
              onDrop={(e) => handleDrop(e, true)}
              onDragLeave={(e) => dragFile(e, true)}
              onDragOver={(e) => dragFile(e, true)}>
              {/* @ts-ignore */}
              <label id="label-json" htmlFor="json">
                <Button onClick={() => (isJsonCacheStored ? undefined : inputJSONRef.current.click())} disabled={isJsonCacheStored}>
                  {isJSONUploaded ? (isJsonCacheStored ? 'JSON Uploaded! ✅' : `Change JSON Cache`) : `Upload JSON Cache`}
                </Button>
                {isJSONUploaded &&
                  (isJsonCacheStored ? null : (
                    <Button
                      sx={{
                        color: 'red'
                      }}
                      onClick={() => {
                        setJson(null)
                        setIsJSONUploaded(false)
                      }}>
                      Delete
                    </Button>
                  ))}
              </label>
              <input
                ref={inputJSONRef}
                onChange={(e) => handleUploadFile(e, true)}
                disabled={isJsonCacheStored}
                accept="application/json"
                type="file"
                style={{ display: 'none' }}
                id="json"
                multiple={false}
              />
            </Box>
            {json !== null && <NavigateNext sx={{ height: 48, width: 48 }} />}
            {json !== null && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Stack direction="column" spacing={2} alignItems="center">
                  <DataObject sx={{ height: 56, width: 56 }} />
                  <p>{json.name}</p>
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>
        {json !== null && (
          <Grid item>
            <LoadingButton
              disabled={json === null || isJsonCacheStored}
              onClick={uploadCacheJSON}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.light' } }}
              loading={configUploadLoading}>
              Upload Cache
            </LoadingButton>
          </Grid>
        )}
      </Grid>
      <h2 style={{ color: '#303030' }}>Upload your config 🍬</h2>
      <Grid container direction="column" spacing={1}>
        <Grid item width={'100%'} sx={{ height: 'auto' }}>
          <Stack direction={'row'} spacing={2} alignItems="center">
            <Box
              component="div"
              sx={{
                p: 2,
                border: '1px dashed grey',
                height: 100,
                width: 300,
                borderRadius: 4,
                bgcolor: isJSONConfigDrag ? 'primary.light' : 'white'
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              onDragEnter={(e) => dragFile(e, false)}
              onDrop={(e) => handleDrop(e, false)}
              onDragLeave={(e) => dragFile(e, false)}
              onDragOver={(e) => dragFile(e, false)}>
              {/* @ts-ignore */}
              <label id="label-json" htmlFor="json">
                <Button onClick={() => (isJsonConfigStored ? undefined : inputJSONConfigRef.current.click())} disabled={isJsonConfigStored}>
                  {isJSONConfigUploaded ? (isJsonConfigStored ? 'JSON Uploaded! ✅' : `Change JSON Config`) : `Upload JSON Config`}
                </Button>
                {isJSONConfigUploaded &&
                  (isJsonConfigStored ? null : (
                    <Button
                      sx={{
                        color: 'red'
                      }}
                      disabled={isJsonConfigStored}
                      onClick={() => {
                        setJson(null)
                        setIsJSONUploaded(false)
                      }}>
                      Delete
                    </Button>
                  ))}
              </label>
              <input
                ref={inputJSONConfigRef}
                onChange={(e) => handleUploadFile(e, false)}
                accept="application/json"
                type="file"
                disabled={isJsonConfigStored}
                style={{ display: 'none' }}
                id="json"
                multiple={false}
              />
            </Box>
            {jsonConfig !== null && <NavigateNext sx={{ height: 48, width: 48 }} />}
            {jsonConfig !== null && (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Stack direction="column" spacing={2} alignItems="center">
                  <DataObject sx={{ height: 56, width: 56 }} />
                  <p>{jsonConfig.name}</p>
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>
        {jsonConfig !== null && (
          <Grid item>
            <LoadingButton
              disabled={jsonConfig === null || isJsonConfigStored}
              onClick={uploadConfigJSON}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.light' } }}
              loading={configCMUploadLoading}>
              Upload Config
            </LoadingButton>
          </Grid>
        )}
      </Grid>
      <LoadingButton
        loading={doneLoader}
        sx={{ mt: 2, bgcolor: 'primary.light', color: 'white' }}
        disabled={json === null || jsonConfig === null}
        onClick={async () => {
          setDoneLoader(true)
          onDoneUpload()
          router.push('/multiple/home', undefined, { shallow: false })
        }}
        variant={'contained'}>
        Done ✅
      </LoadingButton>
      <Snackbar
        open={alertState.open}
        autoHideDuration={alertState.hideDuration === undefined ? 6000 : alertState.hideDuration}
        onClose={() => setAlertState({ ...alertState, open: false })}>
        <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const UploadModal = ({ open, handleClose }) => (
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
        <Stack direction="row" justifyContent={'space-between'} alignItems="center">
          <Typography id="transition-modal-description" fontWeight={'bold'} fontSize={18}>
            Upload your cache.json
          </Typography>
          <IconButton onClick={handleClose}>
            <Close sx={{ color: 'black' }} />
          </IconButton>
        </Stack>
        <JsonUploader onDoneUpload={handleClose} />
      </Box>
    </Fade>
  </Modal>
)

const useStyles = makeStyles((theme: any) => ({
  container: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    minHeight: '100vh',
    padding: '4rem 4rem',
    backgroundSize: `400% 400%`
  },
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%'
    },
    '50%': {
      backgroundPosition: '100% 50%'
    },
    '100%': {
      backgroundPosition: '0% 50%'
    }
  }
}))

const SelectTypePage = (props) => {
  const classes = useStyles()
  const [openUploadModal, setOpenUploadModal] = useState(false)
  return (
    <AuthLayout>
      <Box className={classes.container} display="flex" justifyContent="center" alignItems="center">
        <Box sx={{ p: 2, borderRadius: 4, width: 'auto', height: 'auto', bgcolor: 'white' }}>
          <Grid container direction="column">
            <Grid item>
              <Stack direction={'row'} spacing={2} alignItems="center">
                <h3>Select type</h3>
                <CheckSharp sx={{ color: 'black' }} />
              </Stack>
            </Grid>
            <Grid item>
              <p>Select using cache if you already have your own Candy Machine, or select create if you want to create candy machine</p>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" mt={2}>
            <Box
              sx={{
                borderRadius: 4,
                border: `1px solid black`,
                height: 200,
                width: 200,
                cursor: 'not-allowed',
                backgroundColor: '#D5D5D5',
                p: 2
                // '&:hover': { bgcolor: '#D5D5D5' }
              }}
              display="flex"
              justifyContent="center"
              alignItems="center">
              <h4>Create New (Coming Soon!)</h4>
              <Create sx={{ color: 'black' }} />
            </Box>
            <Box
              sx={{
                borderRadius: 4,
                border: `1px solid black`,
                height: 200,
                width: 200,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.main' }
              }}
              display="flex"
              component={'div'}
              onClick={() => setOpenUploadModal(true)}
              justifyContent="center"
              alignItems="center">
              <h4>Existing Cache</h4>
              <PublishedWithChanges sx={{ color: 'black' }} />
            </Box>
          </Stack>
          <Divider variant="middle" sx={{ my: 3 }} />
          <p style={{ color: 'grey', fontSize: 15 }}>Powered by Native Productions</p>
        </Box>
      </Box>
      <UploadModal open={openUploadModal} handleClose={() => setOpenUploadModal(false)} />
    </AuthLayout>
  )
}

export default SelectTypePage
