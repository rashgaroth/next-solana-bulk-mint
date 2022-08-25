/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Done, Info, Output, PrecisionManufacturing, Settings } from '@mui/icons-material'
import { Alert, Button, CircularProgress, Container, Divider, Grid, Link, Snackbar, Stack, Typography, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Theme, Box } from '@mui/system'
import { useWallet } from '@solana/wallet-adapter-react'
import BreadCrumb from 'components/Breadchumb'
import IconSettingsMenu from 'components/IconSettingsMenu'
import { AlertState } from 'lib/utils'
import Head from 'next/head'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { generateId, truncateWalletAddress } from 'utils/string'
import { Metaplex } from '@metaplex-foundation/js'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import { io, Socket } from 'socket.io-client'
import { ICacheResponse } from 'interfaces/responses/ICacheResponse'
import * as anchor from '@project-serum/anchor'
import AuthLayout from 'layouts/AuthLayout'

type ExecutorType = {
  id: string
  title: string
  emot: string
  disabled: boolean
}

type IUserMetaplexState = {
  mint: number
  candyMachineItems: number
  minted: number
}

type IUserData = {
  candyMachineId: string
  collectionAddress: string
  walletAddress: string
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
  cardContainer: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    zIndex: 1000,
    backgroundSize: `400% 400%`,
    position: 'relative',
    padding: 10,
    borderRadius: 8
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

const ExecutorCard = ({ onClick, emot, title, disable, loading }) => (
  <div onClick={disable || loading ? undefined : onClick}>
    <Box
      sx={{
        width: 150,
        height: 150,
        p: 2,
        my: 2,
        borderRadius: 4,
        bgcolor: '#FFF',
        filter: disable ? 'brightness(40%)' : undefined,
        border: `1px solid grey`,
        cursor: disable ? 'not-allowed' : 'pointer',
        '&:hover': !loading ? { bgcolor: disable ? '#919191' : '#D5D5D5' } : {}
      }}
      display="flex"
      justifyContent="center"
      alignItems="center">
      <Stack direction="column" spacing={0} alignItems="center">
        <h1 style={{ margin: 0 }}>{emot}</h1>
        <p style={{ color: disable ? 'black' : 'black', fontWeight: 'bold', textAlign: 'center' }}>{title}</p>
      </Stack>
    </Box>
  </div>
)

let socket: Socket
const MultipleHome = () => {
  const [execData, setExecData] = useState<ExecutorType[]>([
    {
      id: 'validate',
      title: 'Validate Assets',
      emot: '🌠',
      disabled: false
    },
    {
      id: 'upload',
      title: 'Upload',
      emot: '🍬',
      disabled: false
    },
    {
      id: 'verify',
      title: 'Verify',
      emot: '✅',
      disabled: false
    },
    {
      id: 'show',
      title: 'Show Sugar',
      emot: '🎪',
      disabled: false
    },
    {
      id: 'mint-multiple',
      title: 'Mint All',
      emot: '📲',
      disabled: false
    },
    {
      id: 'mint-one',
      title: 'Mint One',
      emot: '📱',
      disabled: false
    },
    {
      id: 'set-collection',
      title: 'Set Collection',
      emot: '🏞',
      disabled: false
    },
    {
      id: 'remove-collection',
      title: 'Remove Collection',
      emot: '❌',
      disabled: false
    },
    {
      id: 'create-config',
      title: 'Create Config (coming soon)',
      emot: '🛠',
      disabled: true
    }
  ])
  const [alertState, setAlertState] = React.useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const [socketResult, setSocketResult] = React.useState([
    {
      id: generateId(5),
      msg: 'Welcome! NVPlex V 0.5.0',
      color: 'white'
    }
  ])
  const [userData, setUserData] = React.useState<IUserData>({
    candyMachineId: null,
    walletAddress: null,
    collectionAddress: null
  })
  const [metaplexState, setMetaplexState] = React.useState<IUserMetaplexState>({
    mint: 0,
    candyMachineItems: 0,
    minted: 0
  })
  const [isLoading, setIsloading] = React.useState(false)
  const [socketMsg, setSocketMsg] = React.useState('Waiting for instructions...')
  const [socketMsgColor, setSocketMsgColor] = React.useState('white')
  const [isSocketRun, setIsSocketRun] = React.useState(false)
  const [mpxLoading, setMpxLoading] = React.useState(false)
  const [itemWillMint, setItemWillMint] = React.useState(0)

  const terminalRef = useRef<HTMLDivElement>(null)
  const classes = useStyles()
  const largeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const wallet = useWallet()

  const connection = new Connection(clusterApiUrl('mainnet-beta'))
  const metaplex = new Metaplex(connection)

  let socketTemp = ''
  const updateSocketState = (data: string, color = 'white') => {
    if (data !== socketTemp) {
      socketTemp = data
      setSocketResult((curr) => [...curr, { id: generateId(5), msg: data, color }])
    }
  }

  const updateSocketMsg = (data: string, color = 'white') => {
    setSocketMsg(data)
    setSocketMsgColor(color)
  }

  const scrollTerminal = () => {
    terminalRef.current.scroll({
      top: terminalRef.current.scrollHeight as number,
      behavior: 'smooth'
    })
  }

  const init = async () => {
    const userCache = await fetch(`/api/whitelist/get-cache?address=${userData.walletAddress}`)
    if (userCache.status === 200) {
      const userCacheJSON: ICacheResponse = await userCache.json()
      const temp = execData
      const upload = execData.findIndex((x) => x.id === 'upload')
      const validate = execData.findIndex((x) => x.id === 'validate')
      temp[upload].disabled = true
      temp[validate].disabled = true
      setExecData(temp)

      setUserData((curr) => ({
        ...curr,
        candyMachineId: userCacheJSON.data.program.candyMachine,
        collectionAddress: userCacheJSON.data.program.collectionMint
      }))
    }
  }

  const listenSugar = async (type) => {
    try {
      const eSuccess = '✅'
      const eInfo = 'ℹ️'
      let typeDataReturned = ''
      let successDataReturned = ''
      socket.on('connect', () => {
        updateSocketMsg(`Success connected to the socket ${eInfo}`, 'orange')
      })
      socket.on(type, (data: string) => {
        if (typeDataReturned !== data) {
          updateSocketState(data, 'white')
          typeDataReturned = data
        }
      })
      socket.on('success', () => {
        if (successDataReturned !== 'success') {
          updateSocketState(`Successfully run the command ${eSuccess}`, 'green')
          successDataReturned = 'success'
          scrollTerminal()
          setIsloading(false)
          setIsSocketRun(false)
          if (type === 'mint-one') {
            getMetaplexState()
          }
          if (type === 'mint-multiple') {
            getMetaplexState()
          }
        }
      })
    } catch (error) {
      setIsloading(false)
      setIsSocketRun(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  const onClickCard = async (type: string) => {
    if (!mpxLoading) {
      setIsloading(true)
      setIsSocketRun(true)
      fetch('/api/socketio').finally(async () => {
        socket = io()
        if (type.includes('collection')) {
          const stringUserData = JSON.stringify(userData)
          socket.emit(type, stringUserData)
        } else if (type === 'mint-one') {
          socket.emit(type, userData.walletAddress, userData.candyMachineId)
        } else if (type === 'mint-multiple') {
          socket.emit(type, userData.walletAddress, userData.candyMachineId, itemWillMint.toString())
        } else {
          socket.emit(type, userData.walletAddress)
        }
        await listenSugar(type)
      })
    } else {
      setAlertState({
        message: 'Wait for the candy machine info',
        open: true,
        severity: 'info'
      })
    }
  }

  const getMetaplexState = async () => {
    const temp = execData
    const upload = execData.findIndex((x) => x.id === 'mint-one')
    const validate = execData.findIndex((x) => x.id === 'mint-multiple')
    const setCollection = execData.findIndex((x) => x.id === 'set-collection')
    const removeCollection = execData.findIndex((x) => x.id === 'remove-collection')
    try {
      setMpxLoading(true)
      updateSocketState('Get metaplex info ...', 'orange')
      const mintAddress = new PublicKey(wallet.publicKey.toBase58())
      const cdyAddress = new PublicKey(userData.candyMachineId)

      const nfts = await metaplex.nfts().findAllByOwner(mintAddress).run()
      updateSocketState('Done find all nfts by owner', 'white')
      const cdyNfts = await metaplex.candyMachines().findByAddress(cdyAddress).run()
      setMetaplexState((curr) => ({
        ...curr,
        mint: nfts.length,
        candyMachineItems: cdyNfts.items.length
      }))
      const mintedNfts = await metaplex.candyMachines().findMintedNfts(cdyAddress).run()
      updateSocketState('Done find the candy machines items', 'white')
      setMetaplexState((curr) => ({
        ...curr,
        minted: mintedNfts.length
      }))
      const nftWillMint = cdyNfts.items.length - mintedNfts.length
      if (nftWillMint === 0) {
        temp[upload].disabled = true
        temp[validate].disabled = true
        temp[setCollection].disabled = true
        temp[removeCollection].disabled = true
        setExecData(temp)
      }
      if (mintedNfts.length > 0) {
        temp[setCollection].disabled = true
        temp[removeCollection].disabled = true
      }
      setItemWillMint(nftWillMint)
      setMpxLoading(false)
    } catch (error) {
      setMpxLoading(false)
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  const getUserData = async () => {
    try {
      const walletAddress = wallet.publicKey.toBase58()
      setUserData((curr) => ({
        ...curr,
        walletAddress
      }))
    } catch (error) {
      setAlertState({
        message: error.message || 'Network Error',
        open: true,
        severity: 'error'
      })
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      getUserData()
    }
  }, [wallet.connected])

  useEffect(() => {
    if (wallet.connected && userData.candyMachineId !== null) {
      getMetaplexState()
    }
  }, [userData.candyMachineId])

  useEffect(() => {
    if (userData.walletAddress !== null) {
      init()
    }
  }, [userData.walletAddress, wallet.connected])

  return (
    <AuthLayout>
      <div className={classes.container}>
        <Container>
          <Head>
            <title>Sugar Home</title>
          </Head>
          <Grid container direction={'column'} spacing={2}>
            <Grid item width="100%">
              <Stack
                width="100%"
                direction={largeScreen ? 'row' : 'column'}
                justifyContent={'space-between'}
                spacing={2}
                justifyItems="center"
                position="relative"
                alignItems="center">
                <Box
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    width: '70%',
                    height: 600,
                    bgcolor: 'white',
                    filter: isLoading ? 'brightness(40%)' : undefined
                  }}>
                  <BreadCrumb child="UploadAssets" parent="mint" />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <h3>The Executors</h3>
                    <PrecisionManufacturing sx={{ color: '#000' }} />
                  </Stack>
                  <p>
                    Select your button choices to execute your sugar (Candy Machine Command), they will proceed the Candy Machine command
                    inside the server
                  </p>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      maxHeight: 400,
                      overflowY: 'scroll'
                    }}
                    className={classes.cardContainer}
                    justifyItems="center"
                    position="relative"
                    alignItems="center">
                    {execData.map((x) => (
                      <ExecutorCard
                        key={x.id}
                        disable={x.disabled}
                        emot={x.emot}
                        onClick={() => onClickCard(x.id)}
                        title={x.title}
                        loading={isLoading}
                      />
                    ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    width: '30%',
                    height: 600,
                    bgcolor: 'white',
                    filter: isLoading ? 'brightness(40%)' : undefined
                  }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <h3>Settings</h3>
                    <Settings sx={{ color: '#000' }} />
                  </Stack>
                  <IconSettingsMenu />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <h3>Info</h3>
                    <Info sx={{ color: '#000' }} />
                  </Stack>
                  <Stack direction="column" spacing={0} divider={<Divider variant="middle" />}>
                    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                      <p>Account</p>
                      <Link
                        style={{ fontWeight: 'lighter' }}
                        href={`https://explorer.solana.com/address/${userData.walletAddress}`}
                        target="_blank">
                        {userData.walletAddress === null ? 'Loading ...' : truncateWalletAddress(userData.walletAddress, 6)}
                      </Link>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                      <p>Candy Machine</p>
                      {userData.candyMachineId === null ? (
                        <p>Not detected</p>
                      ) : (
                        <Link
                          style={{ fontWeight: 'lighter' }}
                          href={`https://explorer.solana.com/address/${userData.candyMachineId}`}
                          target="_blank">
                          {userData.candyMachineId === null ? 'Not detected' : truncateWalletAddress(userData.candyMachineId, 6)}
                        </Link>
                      )}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                      <p>All Your NFT&apos;s</p>
                      {mpxLoading ? (
                        <CircularProgress size={10} color="warning" />
                      ) : (
                        <p style={{ fontWeight: 'lighter' }}>{metaplexState.mint}</p>
                      )}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                      <p>Candy Machine Items</p>
                      {mpxLoading ? (
                        <CircularProgress size={10} color="warning" />
                      ) : (
                        <p style={{ fontWeight: 'lighter' }}>{metaplexState.candyMachineItems}</p>
                      )}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems={'center'}>
                      <p>Minted NFTs</p>
                      {mpxLoading ? (
                        <CircularProgress size={10} color="warning" />
                      ) : (
                        <p style={{ fontWeight: 'lighter' }}>{metaplexState.minted}</p>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item>
              <Box sx={{ borderRadius: 4, p: 2, width: '100%', minHeight: 250, bgcolor: 'white' }}>
                <Stack direction="row" justifyContent={'space-between'} spacing={2} alignItems="center">
                  <Stack direction={'row'} spacing={3} alignItems="center">
                    <h3>The Output</h3>
                    <Output sx={{ color: '#000' }} />
                  </Stack>
                  {isLoading && (
                    <Stack direction={'row'} spacing={3} alignItems="center">
                      <CircularProgress />
                      <h3 style={{ color: 'black' }}>Loading ...</h3>
                    </Stack>
                  )}
                </Stack>
                <Button
                  variant="text"
                  sx={{ mb: 2 }}
                  onClick={() => {
                    setSocketResult([
                      {
                        id: generateId(5),
                        msg: 'Welcome! NVPlex V 0.5.0',
                        color: 'white'
                      }
                    ])
                  }}>
                  <Typography sx={{ textDecoration: 'underline' }}>Clear</Typography>
                </Button>
                <Box
                  sx={{ width: '100%', borderRadius: 2, backgroundColor: '#242121', maxHeight: 300, p: 2, overflowY: 'scroll' }}
                  component="div"
                  ref={terminalRef}>
                  <Stack direction={'column'} spacing={1}>
                    <code style={{ color: 'white' }}>========== The Output =========</code>
                    {socketResult.map((x, i) => (
                      <>
                        <code key={i} style={{ color: x.color }}>
                          {x.msg}
                        </code>
                      </>
                    ))}
                    <code style={{ color: 'white' }}>========== The State =========</code>
                    <Stack direction="row" alignItems={'center'} spacing={1}>
                      {isSocketRun ? (
                        <CircularProgress size={10} color="warning" />
                      ) : (
                        <Done sx={{ height: 10, width: 10, color: 'green' }} />
                      )}
                      <code style={{ color: socketMsgColor }}>{socketMsg}</code>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
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
    </AuthLayout>
  )
}

export default MultipleHome
