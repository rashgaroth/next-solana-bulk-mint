/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { IRegistrationModal } from 'interfaces/IRegistrationModal'
import { styled } from '@mui/material/styles'
import { AccountBalanceWallet, CurrencyBitcoin, DateRange, NetworkWifi, Settings } from '@mui/icons-material'
import {
  Alert,
  Chip,
  Grid,
  Snackbar,
  Stack,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useSprings, animated } from 'react-spring'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertState } from 'lib/utils'
import * as anchor from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoadingButton } from '@mui/lab'
import { candyMachineConfig } from 'config/candyMachine'
import { IConfig, ISubConfig } from 'providers/interfaces/IConfig'
import firebaseProviders from 'providers/FirebaseProviders'
import { CANDY_MACHINE_PROGRAM } from 'lib/multiMintCandyMachine'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4
}

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
  })
}))

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <Settings />,
    2: <DateRange />,
    3: <AccountBalanceWallet />,
    4: <NetworkWifi />,
    5: <CurrencyBitcoin />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = [
  'Input your Candy Machine ID',
  'Input your start date',
  'Input your treasury address',
  'Input your RPC Url',
  'Setup Your Network'
]

type SolanaTextInput = {
  register: string
  placeholder: string
  a: string
  link: string
  t: string
}

type SolanaNetwork = {
  id: number
  title: string
  value: string
  rpcUrl: string
}

const solanaTextInputList: SolanaTextInput[] = [
  {
    register: 'candyMachineId',
    placeholder: 'Candy Machine Address',
    a: 'How? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/creating-candy-machine',
    t: 'Candy Machine ID'
  },
  {
    register: 'candyMachineStartDate',
    placeholder: 'Candy Machine Start Date',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Start Date (in unixTimestamp)'
  },
  {
    register: 'treasuryAccount',
    placeholder: 'Solana Account',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Solana Treasury Account'
  },
  {
    register: 'rpcUrl',
    placeholder: 'Default: ' + candyMachineConfig.rpcHost,
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Rpc Url'
  }
]

const solanaNetworkChip: SolanaNetwork[] = [
  {
    id: 1,
    title: 'Devnet',
    value: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com'
  },
  {
    id: 2,
    title: 'Testnet',
    value: 'testnet',
    rpcUrl: 'https://api.testnet.solana.com'
  },
  {
    id: 3,
    title: 'Mainnet - Beta',
    value: 'mainnet-beta',
    rpcUrl: 'https://solana-api.projectserum.com'
  }
]

type FormSteps = {
  index: number
  onNext: () => void
  onPrev: () => void
  connection: any
  onFinish: () => void
}

const Form = ({ index, onNext, onPrev, connection, onFinish }: FormSteps) => {
  const wallet = useWallet()
  const schema = yup
    .object({
      candyMachineId: yup.string().required(),
      candyMachineStartDate: yup.number().required(),
      treasuryAccount: yup.string().required()
    })
    .required()
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      candyMachineId: '',
      candyMachineStartDate: '',
      treasuryAccount: ''
    },
    resolver: yupResolver(schema)
  })
  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [networkData, setNetworkData] = React.useState({
    mode: '',
    rpcUrl: ''
  })
  const [selectedChip, setSelectedChip] = React.useState<number>(1)
  const [isFocused, setIsFocused] = React.useState({ focused: false, index: 0 })
  const [loadingButton, setLoadingButton] = React.useState(false)
  const [registForm, setRegistForm] = React.useState({
    candyMachineId: '',
    candyMachineStartDate: '',
    treasuryAccount: '',
    rpcUrl: ''
  })

  const [springs, api] = useSprings(1, (index) =>
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

  React.useEffect(() => {
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

  const onSubmit = (data) => {
    console.log(data)
  }

  const handleClickChip = (data: SolanaNetwork) => {
    setSelectedChip(data.id)
    setNetworkData({
      mode: data.value,
      rpcUrl: data.rpcUrl
    })
  }

  const onClickNext = async () => {
    try {
      setLoadingButton(true)
      // @ts-ignore
      const val = registForm[solanaTextInputList[index === 4 ? 3 : index].register]
      if (val === '') {
        setAlertState({
          open: true,
          message: `${solanaTextInputList[index === 4 ? 3 : index].t} cannot be empty! 😡`,
          severity: 'error'
        })
        setLoadingButton(false)
        return
      }
      if (index === 0) {
        const provider = new anchor.Provider(connection, wallet, {
          preflightCommitment: 'processed'
        })
        const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM, provider)
        const program = new anchor.Program(idl!, CANDY_MACHINE_PROGRAM, provider)
        const state: any = await program.account.candyMachine.fetch(val)
        if (!state.data) {
          setAlertState({
            open: true,
            // @ts-ignore
            message: `${solanaTextInputList[index === 3 ? 2 : index].t} is not a valid Candy Machine`,
            severity: 'error'
          })
          setLoadingButton(false)
          return
        }
      }
      if (index === 1) {
        const d = parseInt(val)
        const date = new Date(d)
        if (date instanceof Date) {
          onNext()
          setLoadingButton(false)
        }
        return
      }
      if (index === 2) {
        const pk = new anchor.web3.PublicKey(val)
        const isAddressValid = await anchor.web3.PublicKey.isOnCurve(pk)
        if (!isAddressValid) {
          setAlertState({
            open: true,
            // @ts-ignore
            message: `Address ${val} is not valid solana address`,
            severity: 'error'
          })
          setLoadingButton(false)
          return
        }
      }
      if (index === 3) {
        const availableRpcUrl = [
          'https://api.devnet.solana.com',
          'https://api.testnet.solana.com',
          'https://solana-api.projectserum.com/',
          'https://solana-api.projectserum.com'
        ]
        if (!availableRpcUrl.includes(registForm.rpcUrl)) {
          setAlertState({
            open: true,
            // @ts-ignore
            message: `Address ${registForm.rpcUrl} is not valid solana RPC url`,
            severity: 'error'
          })
          setLoadingButton(false)
          return
        }
        if (registForm.rpcUrl.includes('mainnet' || 'projectserum')) {
          setSelectedChip(3)
          setNetworkData({ mode: solanaNetworkChip[2].value, rpcUrl: registForm.rpcUrl })
        } //mainnet
        if (registForm.rpcUrl.includes('devnet')) {
          setSelectedChip(1)
          setNetworkData({ mode: solanaNetworkChip[0].value, rpcUrl: registForm.rpcUrl })
        } //devnet
        if (registForm.rpcUrl.includes('testnet')) {
          setSelectedChip(2)
          setNetworkData({ mode: solanaNetworkChip[1].value, rpcUrl: registForm.rpcUrl })
        } //testnet
      }
      if (index === 4) {
        const generatedCollectionId = firebaseProviders.generateCollectionId
        const walletAddr = await wallet.publicKey.toBase58()
        const subConfigData: ISubConfig = {
          candyMachineId: registForm.candyMachineId,
          candyStartDate: registForm.candyMachineStartDate,
          id: `solana-${generatedCollectionId}-${walletAddr}`,
          mode: networkData.mode,
          rpcUrl: registForm.rpcUrl === '' ? candyMachineConfig.rpcHost : registForm.rpcUrl,
          trasuryAddress: registForm.treasuryAccount,
          walletAddress: wallet.publicKey.toBase58()
        }
        const configData: IConfig = {
          id: `config-${generatedCollectionId}`,
          network: 'solana',
          networkId: `solana-${generatedCollectionId}-${walletAddr}`,
          providedAccount: walletAddr
        }
        console.log(configData, subConfigData, '@DATA!!')
        const insert = await firebaseProviders.insertCandyMachineConfig(configData, subConfigData, walletAddr, (err) => {
          setLoadingButton(false)
          setAlertState({
            open: true,
            // @ts-ignore
            message: err.message,
            severity: 'error'
          })
        })
        if (Object.keys(insert).length > 0) {
          onFinish()
        }
        setLoadingButton(false)
        return
      }
      onNext()
      setLoadingButton(false)
    } catch (error) {
      console.log(error, '@error?')
      setLoadingButton(false)
      setAlertState({
        open: true,
        // @ts-ignore
        message: error.message.includes('Invalid account discriminator')
          ? // @ts-ignore
            `Address ${getValues(solanaTextInputList[index === 4 ? 3 : index].register)} is not a valid candy machine`
          : error.message || `${solanaTextInputList[index === 4 ? 3 : index].t} field getting error`,
        severity: 'error'
      })
      return
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="column" alignItems="center" justifyContent={'center'} justifyItems="center">
        <Grid item>
          {index !== 4 ? (
            springs.map((p, i) => (
              <Stack direction={'column'} spacing={2} key={i}>
                <Typography color="white" mt={2} textAlign="center">
                  {solanaTextInputList[index].t}
                </Typography>
                <animated.input
                  style={p}
                  //@ts-ignore
                  {...register(solanaTextInputList[index].register, { required: true })}
                  //@ts-ignore
                  value={registForm[solanaTextInputList[index].register]}
                  //@ts-ignore
                  onChange={(e) =>
                    setRegistForm({
                      ...registForm,
                      [solanaTextInputList[index].register]: e.target.value
                    })
                  }
                  placeholder={solanaTextInputList[index].placeholder}
                  onFocus={() => handleOnClick(i, 1)}
                  onBlur={() => handleOnClick(i, 0)}
                />
                {/* <Typography color={'red'}>{errors[solanaTextInputList[index].register]}</Typography> */}
              </Stack>
            ))
          ) : (
            <Stack direction="column" spacing={2} mt={3}>
              <Typography color="white" textAlign="center" fontWeight={'bold'} fontSize={21}>
                Select Your Network
              </Typography>
              <Stack direction="row" spacing={3}>
                {solanaNetworkChip.map((x) => (
                  <Chip
                    key={x.id}
                    label={
                      <Typography color="white" textAlign="center">
                        {x.title}
                      </Typography>
                    }
                    onClick={() => handleClickChip(x)}
                    variant="outlined"
                    sx={{ bgcolor: x.id === selectedChip ? 'primary.main' : 'primary.900', borderRadius: 2 }}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Grid>
        <Grid item>
          <Stack direction={'row'} spacing={5}>
            <Button
              sx={{
                zIndex: 1000,
                backgroundColor: '#FBA724',
                height: 45,
                borderRadius: 2,
                '&:hover': { backgroundColor: 'darkorange' },
                mt: 2,
                alignSelf: 'end'
              }}
              //@ts-ignore
              disabled={!index > 0}
              onClick={onPrev}>
              <Typography color="white" fontWeight={'bold'}>
                Prev Step
              </Typography>
            </Button>
            <LoadingButton
              loading={loadingButton}
              sx={{
                zIndex: 1000,
                backgroundColor: loadingButton ? '#FFC0B7' : '#FBA724',
                height: 45,
                borderRadius: 2,
                '&:hover': { backgroundColor: 'darkorange' },
                mt: 2,
                alignSelf: 'end'
              }}
              onClick={onClickNext}>
              <Typography color="white" fontWeight={'bold'}>
                {index >= 4 ? `Done` : `Next Step`}
              </Typography>
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar open={alertState.open} autoHideDuration={6000} onClose={() => setAlertState({ ...alertState, open: false })}>
        <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </form>
  )
}

export default function RegistrationCMStepper({ open, handleClose, connection, onFinish }: IRegistrationModal) {
  const [activeStep, setActiveStep] = React.useState(0)

  const onNextStep = () => {
    // eslint-disable-next-line prettier/prettier
    if(activeStep === 4){ return } else { setActiveStep(activeStep + 1) }
  }

  const onPrevStep = () => {
    // eslint-disable-next-line prettier/prettier
    if(activeStep === 0){ return } else { setActiveStep(activeStep - 1) }
  }

  const onFinishSteps = () => {
    handleClose()
    onFinish()
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <Typography color="white">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Form index={activeStep} onNext={onNextStep} onPrev={onPrevStep} connection={connection} onFinish={onFinishSteps} />
      </Box>
    </Modal>
  )
}
