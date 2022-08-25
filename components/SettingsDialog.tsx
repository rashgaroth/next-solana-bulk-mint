import { Settings } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Drawer, Grid, Snackbar, Stack, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { candyMachineConfig } from 'config/candyMachine'
import { ISettingsDialog } from 'interfaces/ISettingsDialog'
import { AlertState } from 'lib/utils'
import firebaseProviders from 'providers/FirebaseProviders'
import { ISubConfig } from 'providers/interfaces/IConfig'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSprings, animated } from 'react-spring'

type SolanaTextInput = {
  register: string
  placeholder: string
  a: string
  link: string
  t: string
  mdl: string
}

const solanaTextInputList: SolanaTextInput[] = [
  {
    register: 'candyMachineId',
    placeholder: 'Candy Machine Address',
    a: 'How? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/creating-candy-machine',
    t: 'Candy Machine ID',
    mdl: 'candyMachineId'
  },
  {
    register: 'candyMachineStartDate',
    placeholder: 'Candy Machine Start Date',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Start Date (in unixTimestamp)',
    mdl: 'candyStartDate'
  },
  {
    register: 'treasuryAccount',
    placeholder: 'Solana Account',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Solana Treasury Account',
    mdl: 'trasuryAddress'
  },
  {
    register: 'rpcUrl',
    placeholder: 'RPC Url',
    a: 'What is that? 🤔',
    link: 'https://docs.solana.com/cluster/rpc-endpoints',
    t: 'Default: ' + candyMachineConfig.rpcHost,
    mdl: 'rpcUrl'
  }
]

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  container: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    zIndex: 1000,
    backgroundSize: `400% 400%`,
    position: 'relative'
  }
}))

const SolanaForm = ({ onFinish }) => {
  const wallet = useWallet()
  const { register, handleSubmit } = useForm()
  const [isFocused, setIsFocused] = useState({ focused: false, index: 0 })
  const [settingsForm, setSettingsForm] = React.useState<ISubConfig>({
    candyMachineId: '',
    candyStartDate: '',
    trasuryAddress: '',
    rpcUrl: '',
    id: '',
    walletAddress: '',
    mode: ''
  })
  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [loading, setLoading] = useState(false)
  const [disabledForm, setDisabledForm] = useState(false)

  const [springs, api] = useSprings(solanaTextInputList.length, (index) =>
    isFocused.focused
      ? {
          height: 45,
          borderRadius: 8,
          width: 350,
          border: `0px`,
          padding: 10,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false
        }
      : {
          height: 45,
          borderRadius: 8,
          width: 350,
          border: `0px`,
          padding: 10,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false
        }
  )

  const handleOnClick = (index, focus) => {
    setIsFocused({ focused: focus === 1 ? true : false, index })
  }

  const initData = async () => {
    try {
      const initValue = await firebaseProviders.getUserConfigByWalletAddress(wallet.publicKey.toBase58())
      if (Object.keys(initValue).length > 0) {
        setSettingsForm(initValue)
      }
    } catch (err) {
      console.log(err, '@errorWhenGetSubConfig')
    }
  }

  useEffect(() => {
    api.start((apiIndex) =>
      isFocused.focused && isFocused.index === apiIndex
        ? {
            height: 45,
            borderRadius: 8,
            width: 350,
            border: `0px`,
            padding: 10,
            scale: 1.1,
            zIndex: 1,
            shadow: 15,
            immediate: (key: string) => key === 'y' || key === 'zIndex'
          }
        : {
            height: 45,
            borderRadius: 8,
            width: 350,
            border: `0px`,
            padding: 10,
            scale: 1,
            zIndex: 0,
            shadow: 1,
            immediate: false
          }
    )
  }, [api, isFocused])

  useEffect(() => {
    initData()
  }, [null])

  const onSubmit = async () => {
    setLoading(true)
    setDisabledForm(true)
    try {
      const walletAddress = await wallet.publicKey.toBase58()
      const updateSettingsData = await firebaseProviders.updateSettingsSubConfig(walletAddress, settingsForm)
      if (Object.keys(updateSettingsData).length > 0) {
        setAlertState({
          open: true,
          message: 'Successfull Updating the data!',
          severity: 'success'
        })
        setLoading(false)
        setDisabledForm(false)
        onFinish()
      }
    } catch (error) {
      setDisabledForm(false)
      setAlertState({
        open: true,
        message: error.message || 'Some Error Occured',
        severity: 'error'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {springs.map((p, i) => (
        <Stack direction={'column'} spacing={2} key={i}>
          <Typography color="white" mt={2}>
            {solanaTextInputList[i].t}
            {' | '}
            <a href={solanaTextInputList[i].link} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
              {solanaTextInputList[i].a}
            </a>
          </Typography>
          <animated.input
            style={p}
            disabled={disabledForm}
            {...register(solanaTextInputList[i].register)}
            placeholder={solanaTextInputList[i].placeholder}
            onFocus={() => handleOnClick(i, 1)}
            onBlur={() => handleOnClick(i, 0)}
            value={settingsForm !== null ? settingsForm[solanaTextInputList[i]['mdl']] : 'Loading ...'}
            onChange={(e) => {
              setSettingsForm({
                ...settingsForm,
                [solanaTextInputList[i].mdl]: e.target.value
              })
            }}
          />
        </Stack>
      ))}
      <Grid container direction="row" alignItems="end" justifyContent={'end'} justifyItems="end">
        <LoadingButton
          loading={loading}
          sx={{
            zIndex: 1000,
            backgroundColor: '#FBA724',
            height: 45,
            borderRadius: 2,
            '&:hover': { backgroundColor: 'darkorange' },
            mt: 2,
            alignSelf: 'end'
          }}
          type="submit">
          <Typography color="white" fontWeight={'bold'}>
            Update
          </Typography>
        </LoadingButton>
      </Grid>
      <Snackbar open={alertState.open} autoHideDuration={6000} onClose={() => setAlertState({ ...alertState, open: false })}>
        <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </form>
  )
}

const drawerWidth = 450
export function SettingsDialog({ anchor, toggleDrawer, open, onFinish }: ISettingsDialog) {
  const classes = useStyles()
  const onFinishForm = () => {
    toggleDrawer(anchor, false)
    onFinish()
  }
  return (
    <React.Fragment key={'aa202'}>
      <Drawer
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(anchor, false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}>
        <Box component={'div'} p={3} className={classes.container}>
          <Stack direction={'column'} spacing={3} alignItems="center" justifyContent={'center'} justifyItems={'center'}>
            <Stack direction={'row'} spacing={2} alignItems="center">
              <Typography component={'div'} variant="h2" color="white" alignItems={'center'}>
                Settings
              </Typography>
              <Settings sx={{ color: 'white' }} />
            </Stack>
            <SolanaForm onFinish={onFinishForm} />
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
