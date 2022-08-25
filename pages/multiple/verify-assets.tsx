/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataObject, Done, FolderZip, NavigateNext } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  linearProgressClasses,
  Snackbar,
  Stack,
  styled
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import BreadCrumb from 'components/Breadchumb'
import { IDragEvent } from 'interfaces/IDragEvents'
import { IUploadErrorResponse } from 'interfaces/responses/IUploadsResponse'
import { AlertState } from 'lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { generateId } from 'utils/string'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#FBA722' : '#FBA722'
  }
}))

interface ICheckerResponse {
  msg: string
}

const useStyles = makeStyles((theme: any) => ({
  container: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    zIndex: 1000,
    backgroundSize: `400% 400%`,
    position: 'relative'
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

const VerifyAssetsPage = (props) => {
  const [uploadLoading, setUploadLoading] = React.useState(false)
  const [configUploadLoading, setConfigUploadLoading] = React.useState(false)

  const [isUploaded, setIsUploaded] = React.useState(false)
  const [isJSONUploaded, setIsJSONUploaded] = React.useState(false)

  const [file, setFile] = React.useState<File>(null)
  const [json, setJson] = React.useState<File>(null)

  const [isDrag, setIsDrag] = React.useState(false)
  const [isJSONDrag, setIsJSONDrag] = React.useState(false)

  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [progressValue, setProgressValue] = React.useState(0)
  const [persistentState, setPersistentState] = React.useState({
    step: 1,
    verifyLoader: false
  })
  const [socketResult, setSocketResult] = React.useState([
    {
      id: generateId(5),
      msg: '$sugar mint🍬',
      color: 'white'
    }
  ])

  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputJSONRef = React.useRef<HTMLInputElement>(null)
  const classes = useStyles()
  const wallet = useWallet()
  const router = useRouter()

  const updateSocketState = (data: string, color = 'black') => {
    setSocketResult((curr) => [...curr, { id: generateId(5), msg: data, color }])
  }

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>, isJson = false) => {
    const file = e.target.files[0]
    if (file.type !== 'application/zip') {
      if (file.type === 'application/json' && isJson) {
        setJson(file)
        setIsJSONUploaded(true)
      }
      setAlertState({
        message: 'File must be ZIP format',
        open: true,
        severity: 'error'
      })
      setIsUploaded(false)
      return
    }
    setFile(file)
    setIsUploaded(true)
  }

  const dragFile = (e: React.DragEvent<HTMLSpanElement>, isJson = false) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (isJson) {
        setIsJSONDrag(true)
        return
      }
      setIsDrag(true)
    } else if (e.type === 'dragleave') {
      if (isJson) {
        setIsJSONDrag(false)
        return
      }
      setIsDrag(false)
    }
  }

  const handleDrop = (e: IDragEvent<HTMLDivElement>, isJson = false) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      console.log(file.type, '@type')
      if (isJson) {
        if (file.type === 'application/json') {
          setJson(e.dataTransfer.files[0])
          setIsJSONUploaded(true)
          setIsJSONDrag(false)
          return
        }
      }
      if (file.type !== 'application/zip') {
        console.log('sini')
        setAlertState({
          message: 'File must be ZIP format',
          open: true,
          severity: 'error'
        })
        setIsUploaded(false)
        return
      }
      setIsDrag(false)
      setFile(e.dataTransfer.files[0])
      setIsUploaded(true)
    }
  }

  const uploadConfigJSON = async () => {
    try {
      setConfigUploadLoading(true)
      const JSONBlob = new Blob([json], { type: 'application/json' })
      const fr = new FileReader()
      fr.addEventListener('load', async (e) => {
        const stringJsonConfig = e.target.result
        const pk = wallet.publicKey.toBase58()
        const upload = await fetch(`/api/whitelist/files/upload?address=${pk}&type=json&config=config&pk=${stringJsonConfig}`, {
          method: 'POST'
        })
        if (upload.status === 200) {
          setConfigUploadLoading(false)
          setAlertState({
            message: 'Config uploaded!',
            open: true,
            severity: 'success'
          })
          router.push('/multiple/home', undefined, { shallow: false })
        } else {
          setAlertState({
            message: 'Network Error',
            open: true,
            severity: 'error'
          })
        }
      })

      fr.readAsText(JSONBlob)
    } catch (error) {
      setConfigUploadLoading(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  const uploadZip = async () => {
    try {
      setUploadLoading(true)
      const pk = wallet.publicKey.toBase58()
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async (ev) => {
        // @ts-ignore
        const base64 = reader.result.split(',').pop()
        if (base64) {
          const upload = await fetch(`/api/whitelist/files/zip?address=${pk}&config=keypair`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // @ts-ignore
            body: JSON.stringify({ base64 })
          })
          if (upload.status === 200) {
            setProgressValue(20)
            setUploadLoading(false)
            setAlertState({
              message: 'Upload Success',
              open: true,
              severity: 'success'
            })
            setPersistentState((curr) => ({
              ...curr,
              step: curr.step + 1
            }))
            updateSocketState('Verifying the assets')
            setPersistentState((curr) => ({ ...curr, verifyLoader: true }))
            const version = await fetch(`/api/whitelist/check-assets?type=version&address=${wallet.publicKey.toBase58()}`)
            if (version.status === 200) {
              const jsonVersion: ICheckerResponse = await version.json()
              updateSocketState(jsonVersion.msg, 'blue')
              updateSocketState('Verifying your assets ...', 'black')
              const verify = await fetch(`/api/whitelist/check-assets?type=verify&address=${wallet.publicKey.toBase58()}`)
              if (verify.status === 200) {
                const jsonVerify = await verify.json()
                updateSocketState(jsonVerify.msg, jsonVerify.msg.includes('look good.') ? 'green' : 'red')
                updateSocketState('Get your solana config ...', 'black')
                setProgressValue(40)
                const getSolanaConfig = await fetch(`/api/whitelist/check-assets?type=solana-config&address=${wallet.publicKey.toBase58()}`)
                if (getSolanaConfig.status === 200) {
                  const solanaConfig = await getSolanaConfig.json()
                  updateSocketState(solanaConfig.msg)
                  setPersistentState((curr) => ({ ...curr, verifyLoader: false, step: curr.step + 1 }))
                  setProgressValue(45)
                } else {
                  const solanaConfig = await getSolanaConfig.json()
                  updateSocketState(solanaConfig.msg, 'red')
                  setProgressValue(20)
                }
              } else {
                const jsonVerify = await verify.json()
                updateSocketState(jsonVerify.msg, 'red')
                setProgressValue(20)
              }
            } else {
              const jsonVersion: ICheckerResponse = await version.json()
              updateSocketState(jsonVersion.msg, 'red')
            }
          } else {
            const json: IUploadErrorResponse = await upload.json()
            setUploadLoading(false)
            setAlertState({
              message: json.msg || 'Network Error',
              open: true,
              severity: 'error'
            })
          }
        }
      }
    } catch (error) {
      setUploadLoading(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  return (
    <div className={classes.container}>
      <Head>
        <title>Upload</title>
      </Head>
      <Container>
        <Stack direction={'column'} spacing={4} mt={3}>
          <Grid item width={'100%'} position="relative">
            <Stack
              direction="column"
              spacing={0}
              width={'50%'}
              sx={{ zIndex: 1000, position: 'fixed', top: 20, boxShadow: 5, bgcolor: 'white', borderRadius: 4, p: 1 }}>
              <p style={{ fontWeight: 'bold', color: '#000' }}>Your Progress | {progressValue} %</p>
              <BorderLinearProgress variant="determinate" value={progressValue} />
            </Stack>
          </Grid>
          <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 4, p: 2 }}>
            <BreadCrumb child="uploadAssets" parent="mint" />
            <h2 style={{ color: '#303030' }}>Let&apos;s upload your assets (.zip) 🖼</h2>
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
                      bgcolor: isDrag ? 'primary.light' : 'white'
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onDragEnter={dragFile}
                    onDrop={handleDrop}
                    onDragLeave={dragFile}
                    onDragOver={dragFile}>
                    <label id="label-json" htmlFor="json">
                      <Button onClick={() => inputRef.current.click()}>{isUploaded ? `Change Assets` : `Upload Assets`}</Button>
                      {isUploaded && (
                        <Button
                          sx={{
                            color: 'red'
                          }}
                          onClick={() => {
                            setFile(null)
                            setIsUploaded(false)
                          }}>
                          Delete
                        </Button>
                      )}
                    </label>
                    <input
                      ref={inputRef}
                      onChange={handleUploadFile}
                      accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                      type="file"
                      style={{ display: 'none' }}
                      id="json"
                      multiple={false}
                    />
                  </Box>
                  {file !== null && <NavigateNext sx={{ height: 48, width: 48 }} />}
                  {file !== null && (
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Stack direction="column" spacing={2}>
                        <FolderZip sx={{ height: 56, width: 56 }} />
                        <p>{file.name}</p>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Grid>
              {file !== null && (
                <Grid item>
                  <LoadingButton
                    disabled={file === null}
                    onClick={uploadZip}
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.light' } }}
                    loading={uploadLoading}>
                    Upload zip
                  </LoadingButton>
                </Grid>
              )}
            </Grid>
          </Box>
          {persistentState.step > 1 && (
            <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 4, p: 2 }}>
              <BreadCrumb child="VerifyAssets" parent="mint" />
              <h2 style={{ color: '#303030' }}>Verify your assets ✅</h2>
              <Grid container direction="column" spacing={1}>
                <Grid item width={'100%'} sx={{ height: 'auto' }}>
                  {persistentState.verifyLoader ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CircularProgress />
                      <p>Verifying your assets using</p>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Done sx={{ color: 'green' }} />
                      <p>Your assets is ready!</p>
                    </Stack>
                  )}
                </Grid>
                <Grid item width={'100%'}>
                  <Box sx={{ bgcolor: '#DEDEDE', width: '100%', p: 2, borderRadius: 2, maxHeight: 200, overflowY: 'scroll' }}>
                    <Stack direction={'column'} spacing={1}>
                      {socketResult.map((x) => (
                        <code key={x.id} style={{ color: x.color }}>
                          {x.msg}
                        </code>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          {persistentState.step > 2 && (
            <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 4, p: 2 }}>
              <BreadCrumb child="UploadConfig" parent="mint" />
              <h2 style={{ color: '#303030' }}>Set your Candy Machine config 🍬</h2>
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
                      <label id="label-json" htmlFor="json">
                        <Button onClick={() => inputJSONRef.current.click()}>
                          {isJSONUploaded ? `Change JSON Config` : `Upload JSON Config`}
                        </Button>
                        {isJSONUploaded && (
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
                        )}
                      </label>
                      <input
                        ref={inputJSONRef}
                        onChange={(e) => handleUploadFile(e, true)}
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
                      disabled={json === null}
                      onClick={uploadConfigJSON}
                      sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.light' } }}
                      loading={configUploadLoading}>
                      Upload Config
                    </LoadingButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Stack>
      </Container>
      <Snackbar
        open={alertState.open}
        autoHideDuration={alertState.hideDuration === undefined ? 6000 : alertState.hideDuration}
        onClose={() => setAlertState({ ...alertState, open: false })}>
        <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default VerifyAssetsPage
