/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as anchor from '@project-serum/anchor'

import styled from 'styled-components'
import { Box, Container, LinearProgress, LinearProgressProps, Snackbar, Stack, Typography } from '@mui/material'
import { Alert } from '@mui/material'
import { Commitment, Connection, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui'
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  mintMultipleToken,
  SetupState
} from 'lib/multiMintCandyMachine'
import { AlertState, getAtaForMint } from 'lib/utils'
import { MintButton } from 'components/MintButton'
import { MintCounter } from 'components/MintCounter'
import { GatewayProvider } from '@civic/solana-gateway-react'
import { sendTransaction } from 'lib/multiConnection'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { candyMachineConfig } from 'config/candyMachine'
import LoadingBackdrop from 'components/Backdrop'
import { makeStyles } from '@mui/styles'

const ConnectButton = styled(WalletDialogButton)`
  width: 300px;
  height: 70px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(90deg, #450bd5 0%, #ea2efb 50%, #ff207a 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 20px;
  font-family: 'iCiel Gotham Ultra';
  font-weight: normal;
  font-size: 1.5rem;
  &:hover {
    transform: scale(1.1);
    transition: all 0.5s;
  }
`

const MintContainer = styled.div`` // add your owns styles here

interface HomeEvents {
  onMinting: () => void
  onFinish: () => void
  onError: () => void
}

export interface HomeProps extends HomeEvents {
  candyMachineId?: anchor.web3.PublicKey
  connection: anchor.web3.Connection
  txTimeout: number
  rpcHost: string
  network: WalletAdapterNetwork
}

interface HomeState {
  candyMachineId?: anchor.web3.PublicKey
  connection: anchor.web3.Connection
  txTimeout: number
  rpcHost: string
  network: WalletAdapterNetwork
}

interface LinearProgressMinted extends LinearProgressProps {
  totalMinted: number
  itemsAvailable: number
}

function LinearProgressWithLabel(props: LinearProgressMinted & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 100 }}>
        <Typography variant="body2" color="text.secondary">{`${props.totalMinted} / ${props.itemsAvailable}`}</Typography>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'red'
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: 'green'
    }
  }
}))

const Home = (props: HomeProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false)
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount | null>(null)
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [isActive, setIsActive] = useState(false)
  const [itemsRemaining, setItemsRemaining] = useState<number>()
  const [isWhitelistUser, setIsWhitelistUser] = useState(false)
  const [isPresale, setIsPresale] = useState(false)
  const [isValidBalance, setIsValidBalance] = useState(false)
  const [needTxnSplit, setNeedTxnSplit] = useState(true)
  const [setupTxn, setSetupTxn] = useState<SetupState>()
  const [mintCount, setMintCount] = useState<number>(1)
  const [itemsAvailable, setItemsAvailable] = useState(0)
  const [itemsRedeemed, setItemsRedeemed] = useState(0)

  const wallet = useWallet()
  const classes = useStyles()

  const anchorWallet = useMemo(() => {
    console.log('sini')
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
      console.log('refreshing')
      if (!anchorWallet) {
        return
      }
      const connection = new Connection(props.rpcHost, commitment)
      if (props.candyMachineId) {
        try {
          const cndy = await getCandyMachineState(anchorWallet, props.candyMachineId, connection)
          let active = cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000
          let presale = false

          console.log(cndy)

          setItemsAvailable(cndy.state.itemsAvailable)
          setItemsRemaining(cndy.state.itemsRemaining)
          setItemsRedeemed(cndy.state.itemsRedeemed)

          // duplication of state to make sure we have the right values!
          let isWLUser = false
          let userPrice = cndy.state.price

          // whitelist mint with token?
          if (cndy?.state.whitelistMintSettings) {
            // is it a presale mint?
            if (
              cndy.state.whitelistMintSettings.presale &&
              (!cndy.state.goLiveDate || cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
            ) {
              presale = true
            }
            // is there a discount?
            if (cndy.state.whitelistMintSettings.discountPrice) {
              userPrice = cndy.state.whitelistMintSettings.discountPrice
            } else {
              // when presale=false and discountPrice=null, mint is restricted
              // to whitelist users only
              if (!cndy.state.whitelistMintSettings.presale) {
                cndy.state.isWhitelistOnly = true
              }
            }
            // retrieves the whitelist token
            const mint = new anchor.web3.PublicKey(cndy.state.whitelistMintSettings.mint)
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0]

            try {
              const balance = await connection.getTokenAccountBalance(token)
              isWLUser = parseInt(balance.value.amount) > 0
              // only whitelist the user if the balance > 0
              setIsWhitelistUser(isWLUser)

              if (cndy.state.isWhitelistOnly) {
                active = isWLUser && (presale || active)
              }
            } catch (e) {
              setIsWhitelistUser(false)
              // no whitelist user, no mint
              if (cndy.state.isWhitelistOnly) {
                active = false
              }
              console.log('There was a problem fetching whitelist token balance')
              console.log(e)
            }
          }

          userPrice = isWLUser ? userPrice : cndy.state.price

          if (cndy?.state.tokenMint) {
            // retrieves the SPL token
            const mint = new anchor.web3.PublicKey(cndy.state.tokenMint)
            const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0]
            try {
              const balance = await connection.getTokenAccountBalance(token)

              const valid = new anchor.BN(balance.value.amount).gte(userPrice)

              // only allow user to mint if token balance >  the user if the balance > 0
              setIsValidBalance(valid)
              active = active && valid
            } catch (e) {
              setIsValidBalance(false)
              active = false
              // no whitelist user, no mint
              console.log('There was a problem fetching SPL token balance')
              console.log(e)
            }
          } else {
            const balance = new anchor.BN(await connection.getBalance(anchorWallet.publicKey))
            const valid = balance.gte(userPrice)
            setIsValidBalance(valid)
            active = active && valid
          }

          // datetime to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.date) {
            if (cndy.state.endSettings.number.toNumber() < new Date().getTime() / 1000) {
              active = false
            }
          }
          // amount to stop the mint?
          if (cndy?.state.endSettings?.endSettingType.amount) {
            const limit = Math.min(cndy.state.endSettings.number.toNumber(), cndy.state.itemsAvailable)
            if (cndy.state.itemsRedeemed < limit) {
              setItemsRemaining(limit - cndy.state.itemsRedeemed)
            } else {
              setItemsRemaining(0)
              cndy.state.isSoldOut = true
            }
          } else {
            setItemsRemaining(cndy.state.itemsRemaining)
          }

          if (cndy.state.isSoldOut) {
            active = false
          }

          const [collectionPDA] = await getCollectionPDA(props.candyMachineId)
          const collectionPDAAccount = await connection.getAccountInfo(collectionPDA)

          setIsActive((cndy.state.isActive = active))
          setIsPresale((cndy.state.isPresale = presale))
          setCandyMachine(cndy)

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
              // setAlertState({
              //   open: true,
              //   message: `RPC Unstable with ${props.rpcHost}`,
              //   severity: 'error',
              //   hideDuration: null
              // })
              return
            } else if (e.message.startsWith('failed to get info about account')) {
              setAlertState({
                open: true,
                message: `RPC Unstable with ${props.rpcHost}`,
                severity: 'error',
                hideDuration: null
              })
            }
          } else {
            // setAlertState({
            //   open: true,
            //   message: `${e}`,
            //   severity: 'error',
            //   hideDuration: null
            // })
          }
          console.log(e)
        }
      } else {
        setAlertState({
          open: true,
          message: `Wrong candy machine`,
          severity: 'error',
          hideDuration: null
        })
      }
    },
    [props.candyMachineId]
  )

  const onMint = async (beforeTransactions: Transaction[] = [], afterTransactions: Transaction[] = []) => {
    const { onError, onFinish, onMinting } = props
    try {
      console.log('onMint!!')
      onMinting()
      setIsUserMinting(true)
      document.getElementById('#identity')?.click()
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let setupMint: SetupState | undefined
        if (needTxnSplit && setupTxn === undefined) {
          setAlertState({
            open: true,
            message: 'Please sign account setup transaction',
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
              message: 'Setup transaction succeeded! Please sign minting transaction',
              severity: 'info'
            })
          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error'
            })
            setIsUserMinting(false)
            return
          }
        } else {
          setAlertState({
            open: true,
            message: 'Please sign minting transaction',
            severity: 'info'
          })
        }

        type MintResult = {
          mintTxIds: string[]
          metadataKeys: anchor.web3.PublicKey[]
        }

        let mintResult: MintResult[] | [] = []
        console.log(mintCount, '@mintCount!!')
        if (mintCount === 1) {
          mintResult = await mintOneToken(candyMachine, wallet.publicKey, beforeTransactions, afterTransactions, setupMint ?? setupTxn)
        } else if (mintCount > 1) {
          mintResult = await mintMultipleToken(candyMachine, wallet.publicKey, mintCount, beforeTransactions, afterTransactions)
        }

        const promiseArray = []

        if (mintResult && mintResult.length > 0) {
          for (const result of mintResult) {
            if (result.mintTxIds && result.mintTxIds.length > 0) {
              for (const mintTxId of result.mintTxIds) {
                promiseArray.push(await awaitTransactionSignatureConfirmation(mintTxId, props.txTimeout, props.connection, true))
              }
            }
          }
        }

        const allTransactionsResult = await Promise.all(promiseArray)

        let totalSuccess = 0
        let totalFailure = 0

        for (const transactionStatus of allTransactionsResult) {
          if (!transactionStatus?.err) {
            totalSuccess += 1
          } else {
            totalFailure += 1
          }
        }

        if (totalFailure === 0) {
          if (totalSuccess === mintCount) {
            onFinish()
            const remaining = itemsRemaining! - mintCount
            setItemsRemaining(remaining)
            setIsActive((candyMachine.state.isActive = remaining > 0))
            candyMachine.state.isSoldOut = remaining === 0
            setSetupTxn(undefined)
            setAlertState({
              open: true,
              message: 'Congratulations! Mint succeeded!',
              severity: 'success'
            })
          } else if (totalSuccess === 0) {
            onFinish()
            setAlertState({
              open: true,
              message: `Mints manually cancelled.`,
              severity: 'error'
            })
          }
        } else {
          onError()
          setAlertState({
            open: true,
            message: `${totalFailure}/${mintCount} mints failed! Please try again!`,
            severity: 'error'
          })
        }

        setMintCount(1)
      }
    } catch (error: any) {
      onError()
      let message = error.msg || 'Minting failed! Please try again!'
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction timeout! Please try again.'
        } else if (error.message.indexOf('0x137') > 0) {
          console.log('0x137')
          console.log(error.message)
          console.log(error)
          message = `SOLD OUT!`
        } else if (error.message.indexOf('0x135') > 0) {
          message = `Insufficient funds to mint. Please fund your wallet.`
        }
      } else {
        if (error.code === 311) {
          console.log('311')
          console.log(error)
          message = `SOLD OUT!`
          window.location.reload()
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error'
      })
      // updates the candy machine state to reflect the latest
      // information on chain
      refreshCandyMachineState()
    } finally {
      setIsUserMinting(false)
    }
  }

  const handleMintCount = (type: string) => {
    switch (type) {
      case 'increment':
        setMintCount((prevState) => {
          let nextState: number
          if (!itemsRemaining || (itemsRemaining && prevState < itemsRemaining)) {
            nextState = prevState + 1
          } else {
            nextState = prevState
          }

          return nextState
        })
        break
      case 'decrement':
        setMintCount((prevState) => {
          let nextState: number
          if (prevState > 1) {
            nextState = prevState - 1
          } else {
            nextState = prevState
          }

          return nextState
        })
        break
      default:
        return
    }
  }

  useEffect(() => {
    if (props.candyMachineId !== null) {
      refreshCandyMachineState()
    }
  }, [])

  function loop() {
    setTimeout(() => {
      console.log('here')
      if (candyMachine === null) {
        console.log('loop!')
        refreshCandyMachineState()
      }
      loop()
    }, 200000)
  }

  useEffect(() => {
    loop()
  }, [refreshCandyMachineState])

  return (
    <div style={{ position: 'relative' }}>
      {!wallet.connected ? (
        <ConnectButton>Connect Wallet</ConnectButton>
      ) : (
        <>
          <MintContainer>
            {candyMachine?.state.isActive && candyMachine?.state.gatekeeper && wallet.publicKey && wallet.signTransaction ? (
              <GatewayProvider
                logo="/assets/images/logo.svg"
                wallet={wallet}
                gatekeeperNetwork={candyMachine?.state?.gatekeeper?.gatekeeperNetwork}
                cluster="mainnet-beta"
                clusterUrl={'https://solana-api.projectserum.com/'}
                handleTransaction={async (transaction: Transaction) => {
                  console.log('onHandleTransaction!!', transaction)
                  setIsUserMinting(true)
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const userMustSign = transaction.signatures.find((sig) => sig.publicKey.equals(wallet.publicKey!))
                  if (userMustSign) {
                    setAlertState({
                      open: true,
                      message: 'Please sign one-time Civic Pass issuance',
                      severity: 'info'
                    })
                    try {
                      transaction = await wallet.signTransaction?.(transaction)
                    } catch (e) {
                      setAlertState({
                        open: true,
                        message: 'User cancelled signing',
                        severity: 'error'
                      })
                      // setTimeout(() => window.location.reload(), 2000);
                      setIsUserMinting(false)
                      throw e
                    }
                  } else {
                    setAlertState({
                      open: true,
                      message: 'Refreshing Civic Pass',
                      severity: 'info'
                    })
                  }
                  try {
                    console.log('sending transactions', transaction, '@!!')
                    await sendTransaction(props.connection, wallet, transaction, [], true, 'confirmed')
                    setAlertState({
                      open: true,
                      message: 'Please sign minting',
                      severity: 'info'
                    })
                  } catch (e) {
                    setAlertState({
                      open: true,
                      message: 'Solana dropped the transaction, please try again' + e.message || 'On Error Undefined',
                      severity: 'warning'
                    })
                    console.error(e)
                    // setTimeout(() => window.location.reload(), 2000);
                    setIsUserMinting(false)
                    throw e
                  }
                  await onMint()
                }}
                broadcastTransaction={false}
                options={{ autoShowModal: false }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent={'space-between'}>
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isUserMinting}
                    setIsMinting={(val) => setIsUserMinting(val)}
                    onMint={onMint}
                    isActive={isActive || (isPresale && isWhitelistUser && isValidBalance)}
                  />
                  <MintCounter mintCount={mintCount} handleMintCount={handleMintCount} />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel
                      // @ts-ignore
                      className={classes.root}
                      variant="determinate"
                      value={100 - (itemsRemaining * 100) / itemsAvailable}
                      sx={{ bgcolor: 'paper', color: '#FFF', p: 1, borderRadius: 4 }}
                      totalMinted={itemsRedeemed}
                      itemsAvailable={itemsAvailable}
                    />
                  </Box>
                </Stack>
              </GatewayProvider>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" justifyContent={'space-between'}>
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={isUserMinting}
                  setIsMinting={(val) => setIsUserMinting(val)}
                  onMint={onMint}
                  isActive={isActive || (isPresale && isWhitelistUser && isValidBalance)}
                />
                <MintCounter mintCount={mintCount} handleMintCount={handleMintCount} />
                <Box sx={{ width: '100%', display: { xs: 'none', md: 'block' } }}>
                  <LinearProgressWithLabel
                    // @ts-ignore
                    className={classes.root}
                    variant="determinate"
                    value={100 - (itemsRemaining * 100) / itemsAvailable}
                    sx={{ bgcolor: 'paper', color: '#FFF', p: 1, borderRadius: 4 }}
                    totalMinted={itemsRedeemed}
                    itemsAvailable={itemsAvailable}
                  />
                </Box>
              </Stack>
            )}
          </MintContainer>
        </>
      )}
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

const getCandyMachineId = (addr): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(addr)

    return candyMachineId
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e)
    return undefined
  }
}

const MultipleMint = ({ onFinish, onMinting, onError }: HomeEvents) => {
  const wallet = useWallet()
  const [backdropLoader, setBackdropLoader] = useState(false)
  const [props, setProps] = useState<HomeState>({
    txTimeout: 30000,
    candyMachineId: null,
    connection: new anchor.web3.Connection(
      candyMachineConfig.rpcHost ? candyMachineConfig.rpcHost : anchor.web3.clusterApiUrl('mainnet-beta')
    ),
    network: candyMachineConfig.network as WalletAdapterNetwork,
    rpcHost: candyMachineConfig.rpcHost
  })
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
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
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
    setBackdropLoader(false)
  }

  useEffect(() => {
    if (wallet.connected) {
      initialPage()
    }
  }, [])

  return backdropLoader || props.candyMachineId === null ? (
    <LoadingBackdrop open={backdropLoader} handleClose={() => setBackdropLoader(false)} />
  ) : (
    <Home
      connection={props.connection}
      network={props.network}
      rpcHost={props.rpcHost}
      txTimeout={props.txTimeout}
      candyMachineId={props.candyMachineId}
      onFinish={onFinish}
      onMinting={onMinting}
      onError={onError}
    />
  )
}

export default MultipleMint
