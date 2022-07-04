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
require('@solana/wallet-adapter-react-ui/styles.css')

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  let network: WalletAdapterNetwork
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('network', 'devnet')
    network = localStorage.getItem('network') as WalletAdapterNetwork
  }
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const endpoint = useMemo(() => clusterApiUrl(network), [])

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
              <Component {...pageProps} />
            </SessionProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}

export default MyApp
