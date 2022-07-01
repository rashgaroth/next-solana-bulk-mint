/* eslint-disable @next/next/no-page-custom-font */
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material'
import { theme } from 'theme'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { SessionProvider } from 'next-auth/react'
import { clusterApiUrl } from '@solana/web3.js'
import { candyMachineConfig } from 'config/candyMachine'
import * as anchor from '@project-serum/anchor'
import { IHomeProps } from 'interfaces/IHomeProps'
require('@solana/wallet-adapter-react-ui/styles.css')

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    const candyMachineId = new anchor.web3.PublicKey(candyMachineConfig.candyMachineId)

    return candyMachineId
  } catch (e) {
    console.log('Failed to construct CandyMachineId', e)
    return undefined
  }
}
const candyMachineId = getCandyMachineId()
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = candyMachineConfig.network as WalletAdapterNetwork
  const endpoint = useMemo(() => clusterApiUrl(network), [])
  const rpcHost = candyMachineConfig.rpcHost

  const txTimeout = 30000 // milliseconds (confirm this works for your project)
  const connection = new anchor.web3.Connection(rpcHost ? rpcHost : anchor.web3.clusterApiUrl('devnet'))

  const props = {
    txTimeout,
    candyMachineId,
    connection,
    network,
    rpcHost
  } as IHomeProps

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter()
    ],
    [network]
  )

  const onWalletError = useCallback((error: WalletError) => {
    console.log(error, '@walletError')
  }, [])
  return (
    <ThemeProvider theme={theme()}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect onError={onWalletError}>
          <WalletModalProvider>
            <SessionProvider session={session}>
              <Component {...pageProps} {...props} />
            </SessionProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}

export default MyApp
