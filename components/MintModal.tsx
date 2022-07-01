/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  Fade,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Modal,
  Snackbar,
  Stack,
  Typography
} from '@mui/material'
import { NextComponentType } from 'next'
import Image from 'next/image'
import styles from 'styles/Dashboard.module.css'
import { Add, PlusOne, Remove } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { Transaction } from '@solana/web3.js'
import { CandyMachineAccount } from 'lib/candyMachine'
import { makeStyles } from '@mui/styles'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import Link from 'next/link'
import { AlertState } from 'lib/utils'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4
}

interface IMintModal {
  handleClose: () => void
  open: boolean
  totalMinted: number
  itemsAvailable: number
  onMint: () => Promise<void>
  isSoldOut: boolean
  isEnded: boolean
  isActive: boolean
  candyMachine: CandyMachineAccount | undefined
  isMinting: boolean
  itemsRemaining: number
  onFinishVerified: () => void
  solscanInfo: string
  alertState: AlertState
  onAlertState: (data: AlertState) => void
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
      <Box sx={{ minWidth: 50 }}>
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

const MintModal = ({
  handleClose,
  open,
  itemsAvailable,
  totalMinted,
  onMint,
  candyMachine,
  isActive,
  isEnded,
  isMinting,
  isSoldOut,
  itemsRemaining,
  onFinishVerified,
  solscanInfo,
  alertState,
  onAlertState
}: IMintModal) => {
  const [countMint, setCountMint] = useState<number>(1)
  const [clicked, setClicked] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const classes = useStyles()
  const { requestGatewayToken, gatewayStatus } = useGateway()

  useEffect(() => {
    setIsVerifying(false)
    if (gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION && clicked) {
      // when user approves wallet verification txn
      setIsVerifying(true)
      onFinishVerified()
    } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      console.log('Verified human, now minting...')
      onFinishVerified()
      onMint()
      setClicked(false)
    }
  }, [gatewayStatus, clicked, setClicked, onMint, onFinishVerified])

  const onChangeCounter = (counter: string) => {
    if (countMint === 0 && counter === 'min') return
    if (counter === 'min') setCountMint(countMint - 1)
    else setCountMint(countMint + 1)
  }

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
          <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 30 }}>
            Mint Now
          </p>
          <CardMedia src="/assets/images/dgp-merged.gif" component={'img'} sx={{ borderRadius: 4 }} height={400} width={100} alt="gif" />
          <Stack direction={'row'} spacing={2} mt={2} mb={2} alignItems={'center'}>
            <IconButton sx={{ bgcolor: 'primary.light' }} onClick={() => onChangeCounter('min')} disabled={countMint === 0}>
              <Remove />
            </IconButton>
            <p className={styles.buttonText} style={{ textAlign: 'center', fontSize: 22, alignSelf: 'center' }}>
              {countMint}
            </p>
            <IconButton sx={{ bgcolor: 'primary.light' }} onClick={() => onChangeCounter('plus')} disabled={countMint === 100}>
              <Add />
            </IconButton>
            <Button
              disabled={clicked || candyMachine?.state.isSoldOut || isSoldOut || isMinting || isEnded || !isActive || isVerifying}
              sx={{ bgcolor: 'primary.light' }}
              onClick={async () => {
                if (isActive && candyMachine?.state.gatekeeper && gatewayStatus !== GatewayStatus.ACTIVE) {
                  handleClose()
                  console.log('Requesting gateway token')
                  setClicked(true)
                  await requestGatewayToken()
                } else {
                  onFinishVerified()
                  console.log('Minting...')
                  await onMint()
                }
              }}>
              <Typography color="white" fontWeight={'bold'} variant="button" component={'div'}>
                Mint
              </Typography>
            </Button>
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel
                className={classes.root}
                variant="determinate"
                value={100 - (itemsRemaining * 100) / itemsAvailable}
                sx={{ bgcolor: 'paper', color: '#FFF', p: 1, borderRadius: 4 }}
                totalMinted={totalMinted}
                itemsAvailable={itemsAvailable}
              />
            </Box>
          </Stack>
          {solscanInfo !== '' && (
            <Typography color="white" fontWeight={'bold'} variant="button" component={'div'}>
              Mint Succeed you can see your transaction at{' '}
              <Typography
                color="green"
                fontWeight={'bold'}
                component={'a'}
                href={solscanInfo}
                target={'__blank'}
                sx={{ textDecoration: 'underline' }}
                mt={3}>
                solscan
              </Typography>
            </Typography>
          )}
          <Snackbar open={alertState.open} autoHideDuration={6000} onClose={() => onAlertState({ ...alertState, open: false })}>
            <Alert onClose={() => onAlertState({ ...alertState, open: false })} severity={alertState.severity}>
              {alertState.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Modal>
  )
}

export default MintModal
