/* eslint-disable react/no-string-refs */
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Alert, Button, Grid, IconButton, Snackbar, Stack, TextField } from '@mui/material'
import { ContentPaste, DataObject } from '@mui/icons-material'
import { AlertState } from 'lib/utils'
import * as web3 from '@solana/web3.js'
import { LoadingButton } from '@mui/lab'
import { ICheckerResponse } from 'interfaces/responses/IChekerResponse'
import { IDragEvent } from 'interfaces/IDragEvents'
import { useWallet } from '@solana/wallet-adapter-react'
import { IUploadResponse } from 'interfaces/responses/IUploadsResponse'
import firebaseProviders from 'providers/FirebaseProviders'
import { ISubConfig } from 'providers/interfaces/IConfig'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

export default function UploaderTabs() {
  const [value, setValue] = React.useState(0)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [file, setFile] = React.useState<File>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [stringPrivateKey, setStringPrivateKey] = React.useState<string>('')
  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [solanaPubkey, setSolanaPubkey] = React.useState('')
  const [checkerLoading, setCheckerLoading] = React.useState(false)
  const [showPublicKey, setShowPublicKey] = React.useState(false)
  const [isDrag, setIsDrag] = React.useState(false)
  const [savedPK, setSavedPK] = React.useState('')
  const [uploadLoading, setUploadLoading] = React.useState(false)
  const [userData, setUserData] = React.useState<ISubConfig>(null)
  const wallet = useWallet()

  const checkPk = async (pk: string): Promise<ICheckerResponse> => {
    try {
      const res = await fetch('/api/whitelist/checkpk?pk=' + pk)
      const json: Promise<ICheckerResponse> = await res.json()
      if (res.status === 200) {
        return json
      } else {
        return null
      }
    } catch (error) {
      setAlertState({
        message: error.message || 'Some error occured',
        open: true,
        severity: 'error'
      })
      return null
    }
  }

  const checkPrivateKey = async () => {
    try {
      setCheckerLoading(true)
      if (stringPrivateKey.startsWith('[') && stringPrivateKey.endsWith(']')) {
        const parsedString: number[] = JSON.parse(stringPrivateKey)
        const pkArray = parsedString.slice(0, 32)
        const pk = web3.Keypair.fromSeed(Uint8Array.from(pkArray))
        const pubkey = pk.publicKey.toBase58()
        setShowPublicKey(true)
        setSolanaPubkey(pubkey)
        setCheckerLoading(false)
        setSavedPK(stringPrivateKey)
      }
      const res = await checkPk(stringPrivateKey)
      if (res !== null) {
        setCheckerLoading(false)
        setShowPublicKey(true)
        setSolanaPubkey(res.pubkey)
        setSavedPK(res.pkArray)
      } else {
        setCheckerLoading(false)
        setShowPublicKey(false)
        setAlertState({
          message: 'Please enter valid private key',
          open: true,
          severity: 'error'
        })
      }
    } catch (error) {
      setCheckerLoading(false)
      setShowPublicKey(false)
      setAlertState({
        message: error.message || 'Some error occured',
        open: true,
        severity: 'error'
      })
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCheckerLoading(false)
    setShowPublicKey(false)
    setSolanaPubkey('')
    setStringPrivateKey('')
    setIsUploaded(false)
    setFile(null)
    setValue(newValue)
  }

  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file.type !== 'application/json') {
      setAlertState({
        message: 'File must be JSON format',
        open: true,
        severity: 'error'
      })
      setIsUploaded(false)
      return
    }
    setFile(file)
    setIsUploaded(true)
  }

  const onPaste = async () => {
    const permissions = await Promise.all(['clipboard-read'].map((name: any) => navigator.permissions.query({ name: name })))
    const permissionsAreOK = permissions[0].state === 'granted'
    if (!permissionsAreOK) {
      setAlertState({
        message:
          'For some browsers, a notification dialog may appears to ask permission to copy the wallet address by access your clipboard.',
        open: true,
        severity: 'error'
      })
    }

    try {
      const text = await navigator.clipboard.readText()
      setStringPrivateKey(text)
    } catch (err) {
      console.log(err, '@error')
      setAlertState({
        message: err.message || 'Clipboard permission denied',
        open: true,
        severity: 'error'
      })
    }
  }

  const dragFile = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDrag(true)
    } else if (e.type === 'dragleave') {
      setIsDrag(false)
    }
  }

  const handleDrop = (e: IDragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrag(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type !== 'application/json') {
        setAlertState({
          message: 'File must be JSON format',
          open: true,
          severity: 'error'
        })
        setIsUploaded(false)
        return
      }
      setFile(e.dataTransfer.files[0])
      setIsUploaded(true)
    }
  }

  const uploadPrivateKey = async () => {
    try {
      setUploadLoading(true)
      if (savedPK === '') {
        setAlertState({
          message: 'Please fill the private key first',
          open: true,
          severity: 'error'
        })
        return
      }
      const address = wallet.publicKey.toBase58()
      const type = 'json'

      const uploadPK = await fetch(`/api/whitelist/files/upload?address=${address}&pk=${savedPK}&type=${type}&config=keypair`, {
        method: 'POST'
      })
      if (uploadPK.status === 200) {
        const res: IUploadResponse = await uploadPK.json()
        if (res.file) {
          setAlertState({
            message: 'Success upload the keypair!',
            open: true,
            severity: 'success'
          })
          setUploadLoading(false)
        }
      } else {
        setUploadLoading(false)
        setAlertState({
          message: 'An unknown error occured',
          open: true,
          severity: 'error'
        })
      }
    } catch (error) {
      setUploadLoading(false)
      setAlertState({
        message: error.message || 'An unknown error occured',
        open: true,
        severity: 'error'
      })
    }
  }

  React.useEffect(() => {
    if (file !== null) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const parsedString: number[] = JSON.parse(event.target.result as string)
        const pkArray = parsedString.slice(0, 32)
        const pk = web3.Keypair.fromSeed(Uint8Array.from(pkArray))
        const pubkey = pk.publicKey.toBase58()
        setShowPublicKey(true)
        setSolanaPubkey(pubkey)
        setSavedPK(event.target.result as string)
      }
      reader.readAsText(file)
    }
  }, [file])

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', display: 'flex', minHeight: 224, mt: 2, borderRadius: 4 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', bgcolor: 'background.default', borderRadius: 4 }}>
        <Tab label="Using JSON" {...a11yProps(0)} />
        <Tab label="Using Private Key" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Grid container direction="column" spacing={3} alignItems="center" justifyContent={'center'}>
            <Grid item>
              <Box
                component="span"
                sx={{ p: 3, border: '1px dashed grey', backgroundColor: isDrag ? 'gray' : 'white' }}
                onDragEnter={dragFile}
                onDrop={handleDrop}
                onDragLeave={dragFile}
                onDragOver={dragFile}>
                <label id="label-json" htmlFor="json">
                  <Button onClick={() => inputRef.current.click()}>
                    {isUploaded ? `Change JSON or drag & drop the file` : `Upload JSON or drag & drop the file`}
                  </Button>
                  {isUploaded && (
                    <Button
                      sx={{
                        color: 'red'
                      }}
                      onClick={() => {
                        setFile(null)
                        setSolanaPubkey('')
                        setShowPublicKey(false)
                        setIsUploaded(false)
                      }}>
                      Delete
                    </Button>
                  )}
                </label>
                <input
                  ref={inputRef}
                  onChange={handleUploadJson}
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  id="json"
                  multiple={false}
                />
              </Box>
            </Grid>
            <Grid item>
              {isUploaded ? (
                <Stack direction={'row'} spacing={2} mt={2}>
                  <Stack direction={'column'} spacing={2}>
                    <Grid>
                      <div style={{ border: `1px solid grey`, padding: 5, borderRadius: 8 }}>
                        <DataObject sx={{ height: 80, width: 80, color: '#EBD41B' }} />
                      </div>
                    </Grid>
                    <Grid>
                      <Typography>{file.name}</Typography>
                    </Grid>
                  </Stack>
                  {showPublicKey && (
                    <Grid alignSelf={'start'}>
                      <Box sx={{ maxWidth: 350 }}>
                        <Typography color="red" maxWidth={300}>
                          This will return current addres: <br /> <strong style={{ maxWidth: 100 }}>{solanaPubkey}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Stack>
              ) : (
                <Grid item>
                  <Typography>Please upload the selected private key</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <LoadingButton
            disabled={savedPK === ''}
            loading={uploadLoading}
            onClick={uploadPrivateKey}
            sx={{ color: 'white', mt: 2, bgcolor: 'primary.light' }}
            variant="contained">
            Upload PrivateKey
          </LoadingButton>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography>Enter your private key</Typography>
            </Grid>
            <Grid item>
              <Stack direction={'row'} spacing={2}>
                <TextField
                  id="standard-textarea"
                  label=""
                  placeholder="Enter unique privatekey"
                  multiline
                  variant="standard"
                  value={stringPrivateKey}
                  onChange={(e) => {
                    setStringPrivateKey(e.target.value)
                  }}
                  sx={{ width: 500 }}
                />
                <IconButton onClick={onPaste}>
                  <ContentPaste />
                </IconButton>
              </Stack>
            </Grid>
            {showPublicKey && stringPrivateKey !== '' && (
              <Grid item>
                <Box sx={{ backgroundColor: 'greenyellow', border: `1px solid green`, borderRadius: 4, p: 2 }}>
                  <Typography color="green">This private key will return as current addres: {solanaPubkey}</Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              {stringPrivateKey !== '' && (
                <LoadingButton loading={checkerLoading} onClick={checkPrivateKey} sx={{ color: 'purple' }} variant="contained">
                  Check private key
                </LoadingButton>
              )}
            </Grid>
          </Grid>
          <LoadingButton
            disabled={savedPK === ''}
            loading={uploadLoading}
            onClick={uploadPrivateKey}
            sx={{ color: 'white', mt: 2, bgcolor: 'primary.light' }}
            variant="contained">
            Submit
          </LoadingButton>
        </Box>
      </TabPanel>
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
