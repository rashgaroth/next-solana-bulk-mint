/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { Box, Button, Grid, Snackbar, Stack, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { NextPage } from 'next'
import { Theme } from '@mui/material/styles'
import Head from 'next/head'
import styles from 'styles/Dashboard.module.css'
import Image from 'next/image'
import { signOut, getSession } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import MintModal from 'components/MintModal'
import { candyMachineConfig } from 'config/candyMachine'
import { IHomeProps } from 'interfaces/IHomeProps'
import * as anchor from '@project-serum/anchor'
import { Cluster, Commitment, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { AlertState, getAtaForMint, toDate } from 'lib/utils'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { CandyMachineAccount, getCandyMachineState } from 'lib/multiMintCandyMachine'
import confetti from 'canvas-confetti'
import CountDownDate from 'components/CountDownDate'

import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { GatewayProvider } from '@civic/solana-gateway-react'
import LoadingBackdrop from 'components/Backdrop'
import { Menu, Settings } from '@mui/icons-material'
import { SettingsDialog } from 'components/SettingsDialog'
import { Anchor } from 'interfaces/ISettingsDialog'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import firebaseProviders from 'providers/FirebaseProviders'
import RegistrationCMStepper from 'components/RegistrationCMStepper'
import useModals from 'hooks/useModals'
import DialogModal from 'components/Modals/DialogModal'
import HomeMenu from 'components/HomeMenu'
import AuthLayout from 'layouts/AuthLayout'
import HorizontalSlider from 'components/HorizontalSlider'

interface IStyleProps {
  left: string | number
  bottom: string | number
  img: string
}

interface IDownStyleProps {
  right: string | number
  top: string | number
  img: string
}

interface IImageList {
  id: number
  style: IStyleProps
}

interface IDownImageList {
  id: number
  style: IDownStyleProps
}

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
  '@keyframes animateUp': {
    '0%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: 0.5,
      borderRadius: 22,
      position: 'absolute'
    },
    '50%': {
      transform: 'translateY(-100vh) rotate(720deg)',
      opacity: 0,
      borderRadius: '50%'
    },
    '100%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: 0.5,
      borderRadius: 22
    }
  },
  '@keyframes animateDown': {
    '0%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: 0.5,
      borderRadius: 22,
      position: 'absolute'
    },
    '50%': {
      transform: 'translateY(100vh) rotate(-720deg)',
      opacity: 0,
      borderRadius: '50%'
    },
    '100%': {
      transform: 'translateY(0) rotate(0deg)',
      opacity: 0.5,
      borderRadius: 22
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
  },
  stickyCard: {
    opacity: 0.5,
    position: 'absolute',
    left: (props: any) => props.left || '10%',
    bottom: (props: any) => props.bottom || '0',
    borderRadius: 22,
    overflow: 'hidden',
    // animation: `$animateUp 25s ${theme.transitions.easing.sharp} infinite`,
    '&:before': {
      transition: 'opacity 2s'
    }
  },
  stickyCardDown: {
    opacity: 0.5,
    position: 'absolute',
    right: (props: any) => props.right || '10%',
    top: (props: any) => props.top || '0',
    borderRadius: 22,
    overflow: 'hidden',
    animation: `$animateDown 25s ${theme.transitions.easing.sharp} infinite`,
    '&:before': {
      transition: 'opacity 2s'
    }
  }
}))

const nftImageList: Array<IImageList> = [
  {
    id: 1,
    style: {
      bottom: '10%',
      left: '0',
      img: '/assets/dgp/11.png'
    }
  },
  {
    id: 2,
    style: {
      bottom: '20%',
      left: '40%',
      img: '/assets/dgp/10.png'
    }
  },
  {
    id: 3,
    style: {
      bottom: '14%',
      left: '70%',
      img: '/assets/dgp/13.png'
    }
  }
]

const nftDownImageList: Array<IDownImageList> = [
  {
    id: 1,
    style: {
      top: '17%',
      right: '0',
      img: '/assets/dgp/12.png'
    }
  }
]

const AnimatedNftCard = ({ bottom, left, img }) => {
  return (
    <Box
      sx={{
        opacity: 0.5,
        position: 'absolute',
        left: left,
        bottom: bottom,
        borderRadius: 22,
        overflow: 'hidden',
        display: { xs: 'none', md: 'flex' },
        zIndex: 0
      }}>
      <Image src={img} width={250} height={250} alt="sticky-image-1" layout="fixed" />
    </Box>
  )
}

const DownAnimatedNftCard = ({ top, right, img }) => {
  return (
    <Box
      sx={{
        opacity: 0.5,
        position: 'absolute',
        right: right,
        top: top,
        borderRadius: 22,
        overflow: 'hidden',
        zIndex: 0
      }}>
      <Image src={img} width={250} height={250} alt="sticky-image-1" layout="fixed" />
    </Box>
  )
}
const getCandyMachineId = (addr): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(addr)

    return candyMachineId
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e)
    return undefined
  }
}
const Home: NextPage = () => {
  const classes = useStyles({ bottom: undefined, left: undefined } as IStyleProps)
  const { disconnect } = useWallet()
  const router = useRouter()
  const wallet = useWallet()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>()
  const [isMinting, setIsMinting] = useState(false) // true when user got to press MINT
  const [isActive, setIsActive] = useState(false) // true when countdown completes or whitelisted
  const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>('')
  const [itemsAvailable, setItemsAvailable] = useState(0)
  const [itemsRemaining, setItemsRemaining] = useState(0)
  const [isEnded, setIsEnded] = useState(false)
  const [backdropLoader, setBackdropLoader] = useState(false)
  const [isPresale, setIsPresale] = useState(false)
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>()
  const [openSettings, setOpenSettings] = useState(false)
  const [props, setProps] = useState<IHomeProps>({
    txTimeout: 30000,
    candyMachineId: null,
    connection: new anchor.web3.Connection(
      candyMachineConfig.rpcHost ? candyMachineConfig.rpcHost : anchor.web3.clusterApiUrl('mainnet-beta')
    ),
    network: candyMachineConfig.network as WalletAdapterNetwork,
    rpcHost: candyMachineConfig.rpcHost
  })
  const [openRegistModal, setOpenRegistModal] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { closeDialog, openDialog, showDialog, desc, init, title, errorDialog } = useModals()

  const initialPage = async () => {
    setBackdropLoader(true)
    // setProps({
    //   txTimeout: 60000,
    //   candyMachineId: null,
    //   connection: new anchor.web3.Connection(
    //     candyMachineConfig.rpcHost ? candyMachineConfig.rpcHost : anchor.web3.clusterApiUrl('mainnet-beta')
    //   ),
    //   network: candyMachineConfig.network as WalletAdapterNetwork,
    //   rpcHost: candyMachineConfig.rpcHost
    // })
    // const userConf = await firebaseProviders.getConfigByWalletAddress(wallet.publicKey.toBase58())
    // The network can be set to 'mainnet-beta', 'testnet', or 'mainnet-beta'.
    // if (userConf !== null) {
    //   const network = userConf.mode as WalletAdapterNetwork
    //   const rpcHost = userConf.rpcUrl

    //   const txTimeout = 30000 // milliseconds (confirm this works for your project)
    //   const connection = new anchor.web3.Connection(rpcHost ? rpcHost : anchor.web3.clusterApiUrl(userConf.mode as Cluster))
    //   const candyMachineId = getCandyMachineId(userConf.candyMachineId)
    //   setBackdropLoader(false)
    //   setProps({
    //     txTimeout,
    //     candyMachineId,
    //     connection,
    //     network,
    //     rpcHost
    //   })
    // } else {
    const txTimeout = 30000 // milliseconds (confirm this works for your project)
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl('mainnet-beta'))
    const candyMachineId = getCandyMachineId(candyMachineConfig.candyMachineId)
    setProps((curr) => ({
      ...curr,
      txTimeout,
      candyMachineId,
      connection,
      network: 'mainnet-beta' as WalletAdapterNetwork,
      rpcHost: candyMachineConfig.rpcHost
    }))
    // }
    setBackdropLoader(false)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const anchorWallet = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
      return
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction
    } as anchor.Wallet
  }, [wallet])

  const refreshCandyMachineState = useCallback(async (commitment: Commitment = 'confirmed') => {
    if (!anchorWallet) {
      return
    }

    const connection = new Connection(props.rpcHost, commitment)

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(anchorWallet, props.candyMachineId, connection)
        console.log(cndy, '@cndy')
        setItemsAvailable(cndy.state.itemsAvailable)
        setItemsRemaining(cndy.state.itemsRemaining)
        setCandyMachine(cndy)
        console.log(cndy.state.goLiveDate.toNumber(), '@cndy')
        // end the mint when amount is reached
        if (cndy?.state.endSettings?.endSettingType.amount) {
          const limit = Math.min(cndy.state.endSettings.number.toNumber(), cndy.state.itemsAvailable)
          setItemsAvailable(limit)
          if (cndy.state.itemsRedeemed < limit) {
            setItemsRemaining(limit - cndy.state.itemsRedeemed)
          } else {
            setItemsRemaining(0)
            cndy.state.isSoldOut = true
            setIsEnded(true)
          }
        } else {
          setItemsRemaining(cndy.state.itemsRemaining)
        }

        if (cndy.state.isSoldOut) {
          setIsActive(false)
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === `Account does not exist ${props.candyMachineId}`) {
            setAlertState({
              open: true,
              message: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`,
              severity: 'error',
              hideDuration: null
            })
          } else if (e.message.startsWith('failed to get info about account')) {
            setAlertState({
              open: true,
              message: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
              severity: 'error',
              hideDuration: null
            })
          }
        } else {
          setAlertState({
            open: true,
            message: `${e}`,
            severity: 'error',
            hideDuration: null
          })
        }
        console.log(e)
      }
    } else {
      setAlertState({
        open: true,
        message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
        severity: 'error',
        hideDuration: null
      })
    }
  }, [])

  const toggleSettingsDrawer = (anchor: Anchor, isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    // eslint-disable-next-line prettier/prettier
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) { return }
    setOpenSettings(isOpen)
  }

  const onError = () => {
    setOpenModal(true)
    setIsMinting(false)
  }

  const onFinish = () => {
    setOpenModal(true)
    setIsMinting(false)
  }

  const onMinting = () => {
    setBackdropLoader(true)
    setOpenModal(false)
    setIsMinting(true)
  }

  const disconnectAndSignOut = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/'
      })
    } catch (err) {
      console.log(err, '@error')
      throw new Error(err)
    }
  }

  const closeMintModal = () => {
    setOpenModal(false)
  }

  const openMintModal = (candyMachineId: anchor.web3.PublicKey | null) => {
    if (candyMachineId !== null) {
      setOpenModal(true)
    } else {
      setOpenRegistModal(true)
    }
  }

  const dialogNegativeButton = () => {
    closeDialog()
  }

  const dialogPositiveButton = () => {
    closeDialog()
  }

  const onFinishRegistration = async () => {
    await initialPage()
    await refreshCandyMachineState()
  }

  const onClickCreateCandyMachine = async () => {
    setAnchorEl(null)
    init('Create candy machine is under development', 'Coming soon!', true)
    openDialog()
    // router.push('/multiple/mint', undefined, { shallow: false })
  }

  const onClickAccount = async () => {
    setAnchorEl(null)
    init('Theme is under development', 'Coming soon!', true)
    openDialog()
  }

  const onClickSettings = () => {
    setAnchorEl(null)
    if (props.candyMachineId === null) {
      init('You need to setup your candy machine', 'Candy machine is not detected', true)
      openDialog()
    } else {
      setOpenSettings(true)
    }
  }

  const toggleMintButton = () => {
    let active = !isActive || isPresale

    if (active) {
      if (candyMachine!.state.isWhitelistOnly) {
        active = false
      }
    }

    if (isPresale && candyMachine!.state.goLiveDate && candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000) {
      setIsPresale((candyMachine!.state.isPresale = false))
    }

    setIsActive((candyMachine!.state.isActive = active))
  }

  useEffect(() => {
    if (wallet.connected && props.candyMachineId === null) {
      console.log('@init!!')
      initialPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.candyMachineId, wallet.connected, wallet.publicKey])

  useEffect(() => {
    ;(async () => {
      if (anchorWallet) {
        const balance = await props.connection.getBalance(anchorWallet!.publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      }
    })()
  }, [anchorWallet, init, openDialog, props.connection])

  useEffect(() => {
    if (props.candyMachineId !== null) {
      refreshCandyMachineState()
    } else {
      if (!openDialog) {
        init('You need to setup candy machine config', 'No candy machine found', true)
        openDialog()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  return (
    <AuthLayout>
      <div className={classes.container}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="NFTs Generator for Duck Goes Places" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box sx={{ zIndex: 999 }}>
          <Grid container direction={'column'} spacing={3}>
            <Grid item>
              <Typography variant="h1" textAlign={'center'} fontWeight="bolder" className={styles.welcome}>
                Welcome To DGP NFT
              </Typography>
              <Typography variant="h3" textAlign={'center'} color="white">
                Mint your DGP Now!
              </Typography>
            </Grid>
          </Grid>
          <div className={styles.tron}>
            <p className={styles.duckText}>Duck Goes Places</p>
            <Stack direction={'row'} spacing={2} alignItems="center" justifyContent={'end'}>
              <Button
                // @ts-ignore
                disabled={!isActive && !isEnded && candyMachine?.state.goLiveDate}
                sx={{
                  zIndex: 1000,
                  backgroundColor: !isActive && !isEnded && candyMachine?.state.goLiveDate ? '#919191' : '#FBA724',
                  px: 3,
                  py: 2.5,
                  borderRadius: 4,
                  '&:hover': { backgroundColor: 'darkorange' }
                }}
                onClick={handleOpenMenu}>
                <Menu sx={{ color: 'white' }} />
              </Button>
              <HomeMenu
                anchorEl={anchorEl}
                handleClose={() => setAnchorEl(null)}
                open={open}
                onClickAccount={onClickAccount}
                onClickCreateCandyMachine={onClickCreateCandyMachine}
                onClickSetting={onClickSettings}
                onClickSugar={() => {
                  router.push('/multiple/mint')
                }}
              />
              <Button
                // @ts-ignore
                disabled={!isActive && !isEnded && candyMachine?.state.goLiveDate}
                sx={{
                  zIndex: 1000,
                  backgroundColor: !isActive && !isEnded && candyMachine?.state.goLiveDate ? '#919191' : '#FBA724',
                  px: 3,
                  py: 2.5,
                  borderRadius: 4,
                  '&:hover': { backgroundColor: 'darkorange' }
                }}
                onClick={() => openMintModal(props.candyMachineId)}>
                <Typography color="white" fontWeight={'bold'} variant="h4">
                  {props.candyMachineId !== null ? 'Mint Now' : 'Setup Config'}
                </Typography>
              </Button>
              <div className={styles.walletContainer}>
                <ul className={styles.ulWallet}>
                  {wallet ? (
                    <div className={styles.walletAmount}>
                      {(balance || 0).toLocaleString()} SOL
                      <WalletMultiButton className={styles.connectWallet} />
                      <WalletDisconnectButton
                        className={styles.disconnectWallet}
                        onClick={async () => {
                          await disconnectAndSignOut()
                        }}
                      />
                    </div>
                  ) : (
                    <WalletMultiButton className={styles.connectWallet}>Connect Wallet</WalletMultiButton>
                  )}
                </ul>
              </div>
            </Stack>
            {!isActive && !isEnded && candyMachine?.state.goLiveDate && (
              <Countdown
                date={toDate(candyMachine?.state.goLiveDate)}
                onMount={({ completed }) => completed && setIsActive(!isEnded)}
                onComplete={toggleMintButton}
                renderer={(props: CountdownRenderProps) => <CountDownDate {...props} />}
              />
            )}
          </div>
        </Box>
        {nftImageList.map((x) => (
          <AnimatedNftCard bottom={x.style.bottom} left={x.style.left} key={x.id} img={x.style.img} />
        ))}
        {nftDownImageList.map((x) => (
          <DownAnimatedNftCard top={x.style.top} right={x.style.right} key={x.id} img={x.style.img} />
        ))}
        {/* {candyMachine?.state.isActive && candyMachine?.state.gatekeeper && wallet.publicKey && wallet.signTransaction ? ( */}
        <MintModal
          handleClose={closeMintModal}
          open={openModal}
          solscanInfo={solanaExplorerLink}
          alertState={alertState}
          onAlertState={(data) => setAlertState(data)}
          isMinting={isMinting}
          itemsRemaining={itemsRemaining}
          totalMinted={itemsAvailable}
          onError={onError}
          onFinish={onFinish}
          onMinting={onMinting}
        />
        <LoadingBackdrop open={backdropLoader} handleClose={() => setBackdropLoader(false)} />
        <SettingsDialog open={openSettings} anchor="left" toggleDrawer={toggleSettingsDrawer} onFinish={onFinishRegistration} />
        <RegistrationCMStepper
          open={openRegistModal}
          handleClose={() => setOpenRegistModal(false)}
          connection={props.connection}
          onFinish={onFinishRegistration}
        />
        <DialogModal
          desc={desc}
          title={title}
          handleClose={closeDialog}
          open={showDialog}
          negativeButton={dialogNegativeButton}
          positivieButton={dialogPositiveButton}
          isError={errorDialog}
        />
        {/* <HorizontalSlider /> */}
        <ul className={styles.circles}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </AuthLayout>
  )
}

export default Home
