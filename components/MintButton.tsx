import styled from 'styled-components'
import { CandyMachineAccount } from 'lib/multiMintCandyMachine'
import { Button, Typography } from '@mui/material'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { useEffect, useState, useRef } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  findGatewayToken,
  getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
  onGatewayTokenChange,
  removeAccountChangeListener
} from '@identity.com/solana-gateway-ts'
import { LoadingButton } from '@mui/lab'

export const CTAButton = styled(Button)`
  width: 220px;
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

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
  setIsMinting,
  isActive
}: {
  onMint: () => Promise<void>
  candyMachine?: CandyMachineAccount
  isMinting: boolean
  setIsMinting: (val: boolean) => void
  isActive: boolean
}) => {
  const wallet = useWallet()
  const connection = useConnection()
  const [verified, setVerified] = useState(false)
  const { requestGatewayToken, gatewayStatus } = useGateway()
  const [webSocketSubscriptionId, setWebSocketSubscriptionId] = useState(-1)
  const [clicked, setClicked] = useState(false)

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT'
    } else if (candyMachine?.state.isPresale || candyMachine?.state.isWhitelistOnly) {
      return 'WHITELIST MINT'
    }

    return 'MINT NOW'
  }

  useEffect(() => {
    const mint = async () => {
      await removeAccountChangeListener(connection.connection, webSocketSubscriptionId)
      await onMint()

      setClicked(false)
      setVerified(false)
    }
    if (verified && clicked) {
      mint()
    }
  }, [verified, clicked, connection.connection, onMint, webSocketSubscriptionId])

  const previousGatewayStatus = usePrevious(gatewayStatus)
  useEffect(() => {
    const fromStates = [GatewayStatus.NOT_REQUESTED, GatewayStatus.REFRESH_TOKEN_REQUIRED]
    const invalidToStates = [...fromStates, GatewayStatus.UNKNOWN]
    if (fromStates.find((state) => previousGatewayStatus === state) && !invalidToStates.find((state) => gatewayStatus === state)) {
      setIsMinting(true)
    }
  }, [setIsMinting, previousGatewayStatus, gatewayStatus])

  return (
    <LoadingButton
      loading={isMinting}
      disabled={isMinting || !isActive}
      sx={{ width: 250, bgcolor: 'primary.light' }}
      onClick={async () => {
        console.log('on clicked!')
        if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
          const network = candyMachine.state.gatekeeper.gatekeeperNetwork.toBase58()
          console.log(network, '@network?')
          if (network === 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6') {
            if (gatewayStatus === GatewayStatus.ACTIVE) {
              await onMint()
            } else {
              console.log(gatewayStatus, '@gatewayStatus?')
              // setIsMinting(true);
              await requestGatewayToken()
              console.log('after: ', gatewayStatus)
            }
          } else if (
            network === 'ttib7tuX8PTWPqFsmUFQTj78MbRhUmqxidJRDv4hRRE' ||
            network === 'tibePmPaoTgrs929rWpu755EXaxC7M3SthVCf6GzjZt'
          ) {
            setClicked(true)
            const gatewayToken = await findGatewayToken(
              connection.connection,
              wallet.publicKey!,
              candyMachine.state.gatekeeper.gatekeeperNetwork
            )

            if (gatewayToken?.isValid()) {
              await onMint()
            } else {
              window.open(`https://verify.encore.fans/?gkNetwork=${network}`, '_blank')

              const gatewayTokenAddress = await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
                wallet.publicKey!,
                candyMachine.state.gatekeeper.gatekeeperNetwork
              )

              setWebSocketSubscriptionId(
                onGatewayTokenChange(connection.connection, gatewayTokenAddress, () => setVerified(true), 'confirmed')
              )
            }
          } else {
            setClicked(false)
            throw new Error(`Unknown Gatekeeper Network: ${network}`)
          }
        } else {
          await onMint()
          setClicked(false)
        }
      }}
      variant="contained">
      <Typography color="white" fontWeight={'bold'} variant="button" component={'div'}>
        {getMintButtonContent()}
      </Typography>
    </LoadingButton>
  )
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
