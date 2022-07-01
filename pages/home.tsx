/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { Alert, Box, Button, Grid, Snackbar, Stack, Typography } from '@mui/material'
import { makeStyles, ThemeOfStyles } from '@mui/styles'
import { NextComponentType, NextPage } from 'next'
import { Theme } from '@mui/material/styles'
import Head from 'next/head'
import styles from 'styles/Dashboard.module.css'
import Image from 'next/image'
import { signOut, getSession } from 'next-auth/react'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import MintModal from 'components/MintModal'
import { candyMachineConfig } from 'config/candyMachine'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { IHomeProps } from 'interfaces/IHomeProps'
import * as anchor from '@project-serum/anchor'
import { Commitment, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { AlertState, getAtaForMint, toDate } from 'lib/utils'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  SetupState
} from 'lib/candyMachine'
import confetti from 'canvas-confetti'
import CountDownDate from 'components/CountDownDate'
import styled from '@mui/system'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { GatewayProvider } from '@civic/solana-gateway-react'
import LoadingBackdrop from 'components/Backdrop'

const cluster = candyMachineConfig.network
const decimals = 9
const splTokenName = 'DGP'

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

interface IAlertState {
  open: boolean
  message: string
  severity: 'success' | 'info' | 'warning' | 'error' | undefined
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
  },
  {
    id: 2,
    style: {
      top: '22%',
      right: '40%',
      img: '/assets/dgp/14.png'
    }
  }
  // {
  //   id: 3,
  //   style: {
  //     top: '45%',
  //     right: '70%',
  //     img: '/assets/dgp/15.png'
  //   }
  // }
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

const Home: NextPage = (props: IHomeProps) => {
  const classes = useStyles({ bottom: undefined, left: undefined } as IStyleProps)
  const { disconnect } = useWallet()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>()
  const [isMinting, setIsMinting] = useState(false) // true when user got to press MINT
  const [isActive, setIsActive] = useState(false) // true when countdown completes or whitelisted
  const [solanaExplorerLink, setSolanaExplorerLink] = useState<string>('')
  const [itemsAvailable, setItemsAvailable] = useState(0)
  const [itemsRedeemed, setItemsRedeemed] = useState(0)
  const [itemsRemaining, setItemsRemaining] = useState(0)
  const [isSoldOut, setIsSoldOut] = useState(false)
  const [payWithSplToken, setPayWithSplToken] = useState(false)
  const [price, setPrice] = useState(0)
  const [priceLabel, setPriceLabel] = useState<string>('SOL')
  const [whitelistPrice, setWhitelistPrice] = useState(0)
  const [whitelistEnabled, setWhitelistEnabled] = useState(false)
  const [isBurnToken, setIsBurnToken] = useState(false)
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0)
  const [isEnded, setIsEnded] = useState(false)
  const [endDate, setEndDate] = useState<Date>()
  const [backdropLoader, setBackdropLoader] = useState(false)
  const [isPresale, setIsPresale] = useState(false)
  const [isWLOnly, setIsWLOnly] = useState(false)
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [needTxnSplit, setNeedTxnSplit] = useState(true)
  const [setupTxn, setSetupTxn] = useState<SetupState>()
  const wallet = useWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>()
  const router = useRouter()

  const rpcUrl = props.rpcHost
  const solFeesEstimation = 0.012 // approx of account creation fees

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

  const refreshCandyMachineState = useCallback(
    async (commitment: Commitment = 'confirmed') => {
      if (!anchorWallet) {
        return
      }

      const connection = new Connection(props.rpcHost, commitment)

      if (props.candyMachineId) {
        try {
          const cndy = await getCandyMachineState(anchorWallet, props.candyMachineId, connection)

          setCandyMachine(cndy)
          setItemsAvailable(cndy.state.itemsAvailable)
          setItemsRemaining(cndy.state.itemsRemaining)
          setItemsRedeemed(cndy.state.itemsRedeemed)

          let divider = 1
          if (decimals) {
            divider = +('1' + new Array(decimals).join('0').slice() + '0')
          }

          // detect if using spl-token to mint
          if (cndy.state.tokenMint) {
            setPayWithSplToken(true)
            // Customize your SPL-TOKEN Label HERE
            // TODO: get spl-token metadata name
            setPriceLabel(splTokenName)
            setPrice(cndy.state.price.toNumber() / divider)
            setWhitelistPrice(cndy.state.price.toNumber() / divider)
          } else {
            setPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL)
            setWhitelistPrice(cndy.state.price.toNumber() / LAMPORTS_PER_SOL)
          }

          // fetch whitelist token balance
          if (cndy.state.whitelistMintSettings) {
            setWhitelistEnabled(true)
            setIsBurnToken(cndy.state.whitelistMintSettings.mode.burnEveryTime)
            setIsPresale(cndy.state.whitelistMintSettings.presale)
            setIsWLOnly(!isPresale && cndy.state.whitelistMintSettings.discountPrice === null)

            if (
              cndy.state.whitelistMintSettings.discountPrice !== null &&
              cndy.state.whitelistMintSettings.discountPrice !== cndy.state.price
            ) {
              if (cndy.state.tokenMint) {
                setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / divider)
              } else {
                setWhitelistPrice(cndy.state.whitelistMintSettings.discountPrice?.toNumber() / LAMPORTS_PER_SOL)
              }
            }

            let balance = 0
            try {
              const tokenBalance = await props.connection.getTokenAccountBalance(
                (
                  await getAtaForMint(cndy.state.whitelistMintSettings.mint, anchorWallet.publicKey)
                )[0]
              )

              balance = tokenBalance?.value?.uiAmount || 0
            } catch (e) {
              console.error(e)
              balance = 0
            }
            if (commitment !== 'processed') {
              setWhitelistTokenBalance(balance)
            }
            setIsActive(isPresale && !isEnded && balance > 0)
          } else {
            setWhitelistEnabled(false)
          }

          // end the mint when date is reached
          if (cndy?.state.endSettings?.endSettingType.date) {
            setEndDate(toDate(cndy.state.endSettings.number))
            if (cndy.state.endSettings.number.toNumber() < new Date().getTime() / 1000) {
              setIsEnded(true)
              setIsActive(false)
            }
          }
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

          const [collectionPDA] = await getCollectionPDA(props.candyMachineId)
          const collectionPDAAccount = await connection.getAccountInfo(collectionPDA)

          const txnEstimate =
            892 +
            (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
            (cndy.state.tokenMint ? 66 : 0) +
            (cndy.state.whitelistMintSettings ? 34 : 0) +
            (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 34 : 0) +
            (cndy.state.gatekeeper ? 33 : 0) +
            (cndy.state.gatekeeper?.expireOnUse ? 66 : 0)

          setNeedTxnSplit(txnEstimate > 1230)
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
    },
    [anchorWallet, props.candyMachineId, props.rpcHost, isEnded, isPresale, props.connection]
  )

  function displaySuccess(mintPublicKey: any, qty = 1): void {
    const remaining = itemsRemaining - qty
    setItemsRemaining(remaining)
    setIsSoldOut(remaining === 0)
    if (isBurnToken && whitelistTokenBalance && whitelistTokenBalance > 0) {
      const balance = whitelistTokenBalance - qty
      setWhitelistTokenBalance(balance)
      setIsActive(isPresale && !isEnded && balance > 0)
    }
    setSetupTxn(undefined)
    setItemsRedeemed(itemsRedeemed + qty)
    if (!payWithSplToken && balance && balance > 0) {
      setBalance(balance - (whitelistEnabled ? whitelistPrice : price) * qty - solFeesEstimation)
    }
    setSolanaExplorerLink(
      cluster === 'devnet' || cluster === 'testnet'
        ? 'https://solscan.io/token/' + mintPublicKey + '?cluster=' + cluster
        : 'https://solscan.io/token/' + mintPublicKey
    )
    setIsMinting(false)
    throwConfetti()
    setOpenModal(true)
  }

  function throwConfetti(): void {
    confetti({
      particleCount: 400,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const onMint = async (beforeTransactions: Transaction[] = [], afterTransactions: Transaction[] = []) => {
    try {
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        setBackdropLoader(true)
        setIsMinting(true)
        let setupMint: SetupState | undefined
        if (needTxnSplit && setupTxn === undefined) {
          setAlertState({
            open: true,
            message: 'Please validate account setup transaction',
            severity: 'info'
          })
          setupMint = await createAccountsForMint(candyMachine, wallet.publicKey)
          let status: any = { err: true }
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(setupMint.transaction, props.txTimeout, props.connection, true)
          }
          if (status && !status.err) {
            setSetupTxn(setupMint)
            setAlertState({
              open: true,
              message: 'Setup transaction succeeded! You can now validate mint transaction',
              severity: 'info'
            })
          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error'
            })
            return
          }
        }

        const setupState = setupMint ?? setupTxn
        const mint = setupState?.mint ?? anchor.web3.Keypair.generate()
        const mintResult = await mintOneToken(candyMachine, wallet.publicKey, mint, beforeTransactions, afterTransactions, setupState)

        let status: any = { err: true }
        let metadataStatus = null
        if (mintResult) {
          status = await awaitTransactionSignatureConfirmation(mintResult.mintTxId, props.txTimeout, props.connection, true)

          metadataStatus = await candyMachine.program.provider.connection.getAccountInfo(mintResult.metadataKey, 'processed')
          console.log('Metadata status: ', !!metadataStatus)
        }

        if (status && !status.err && metadataStatus) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success'
          })

          // update front-end amounts
          setBackdropLoader(false)
          displaySuccess(mint.publicKey)
          refreshCandyMachineState('processed')
        } else if (status && !status.err) {
          setBackdropLoader(false)
          setAlertState({
            open: true,
            message:
              'Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.',
            severity: 'error',
            hideDuration: 8000
          })
          refreshCandyMachineState()
        } else {
          setBackdropLoader(false)
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error'
          })
          refreshCandyMachineState()
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!'
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.'
        } else if (error.message.indexOf('0x138')) {
          message = 'Eror Unreadable'
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error'
      })
      setBackdropLoader(false)
    } finally {
      setIsMinting(false)
      setBackdropLoader(false)
    }
  }

  const disconnectAndSignOut = async () => {
    try {
      await disconnect()
      await signOut({
        redirect: true,
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

  const openMintModal = () => {
    setOpenModal(true)
  }

  const checkSession = async () => {
    const session = await getSession()
    if (!isActive && !isEnded && candyMachine?.state.goLiveDate && (!isWLOnly || whitelistTokenBalance > 0)) {
      if (!wallet.connected && session !== null) {
        disconnectAndSignOut()
      }
    }
  }

  const checkAuthorize = async () => {
    const session = await getSession()
    if (session === null) {
      router.push('/')
    }
  }

  useEffect(() => {
    ;(async () => {
      if (anchorWallet) {
        const balance = await props.connection.getBalance(anchorWallet!.publicKey)
        console.log(balance, '@balance??')
        setBalance(balance / LAMPORTS_PER_SOL)
      }
    })()
  }, [anchorWallet, props.connection])

  useEffect(() => {
    checkSession()
  }, [wallet])

  useEffect(() => {
    refreshCandyMachineState()
  }, [anchorWallet, props.candyMachineId, props.connection, isEnded, isPresale, refreshCandyMachineState])

  useEffect(() => {
    checkAuthorize()
  }, [])

  return (
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
              disabled={!isActive && !isEnded && candyMachine?.state.goLiveDate && (!isWLOnly || whitelistTokenBalance > 0)}
              sx={{
                zIndex: 1000,
                backgroundColor:
                  !isActive && !isEnded && candyMachine?.state.goLiveDate && (!isWLOnly || whitelistTokenBalance > 0)
                    ? '#919191'
                    : '#FBA724',
                px: 3,
                py: 2.5,
                borderRadius: 4,
                '&:hover': { backgroundColor: 'darkorange' }
              }}
              onClick={openMintModal}>
              <Typography color="white" fontWeight={'bold'} variant="h4">
                Mint Now
              </Typography>
            </Button>
            <div className={styles.walletContainer}>
              <ul className={styles.ulWallet}>
                {wallet ? (
                  <div className={styles.walletAmount}>
                    {(balance || 0).toLocaleString()} SOL
                    <WalletMultiButton className={styles.connectWallet} />
                  </div>
                ) : (
                  <WalletMultiButton className={styles.connectWallet}>Connect Wallet</WalletMultiButton>
                )}
              </ul>
            </div>
          </Stack>
          {!isActive && !isEnded && candyMachine?.state.goLiveDate && (!isWLOnly || whitelistTokenBalance > 0) && (
            <Countdown
              date={toDate(candyMachine?.state.goLiveDate)}
              onMount={({ completed }) => completed && setIsActive(!isEnded)}
              onComplete={() => {
                setIsActive(!isEnded)
              }}
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
      <GatewayProvider
        wallet={{
          publicKey: wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
          //@ts-ignore
          signTransaction: wallet.signTransaction
        }}
        // // Replace with following when added
        // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
        gatekeeperNetwork={candyMachine?.state?.gatekeeper?.gatekeeperNetwork} // This is the ignite (captcha) network
        /// Don't need this for mainnet
        clusterUrl={rpcUrl}
        cluster={cluster}
        options={{ autoShowModal: false }}>
        <MintModal
          handleClose={closeMintModal}
          open={openModal}
          itemsAvailable={itemsAvailable}
          totalMinted={itemsRedeemed}
          onMint={onMint}
          candyMachine={candyMachine}
          isActive={isActive}
          isEnded={isEnded}
          isMinting={isMinting}
          isSoldOut={isSoldOut}
          itemsRemaining={itemsRemaining}
          onFinishVerified={() => setOpenModal(true)}
          solscanInfo={solanaExplorerLink}
          alertState={alertState}
          onAlertState={(data) => setAlertState(data)}
        />
      </GatewayProvider>
      <LoadingBackdrop open={backdropLoader} handleClose={() => setBackdropLoader(false)} />
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
  )
}

export default Home
