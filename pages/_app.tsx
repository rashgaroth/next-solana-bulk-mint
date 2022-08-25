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
import { useMemo, useState } from 'react'
import { useCallback } from 'react'
import { SessionProvider } from 'next-auth/react'
import { clusterApiUrl } from '@solana/web3.js'
import { ModalProvider } from 'hooks/useModals'
import '@solana/wallet-adapter-react-ui/styles.css'
import TopBarProgress, { TopBarConfig } from 'react-topbar-progress-indicator'
import { Router } from 'next/router'

const progressBarConfig = (): TopBarConfig =>
  ({
    barColors: {
      0: '#2563eb'
    },
    shadowBlur: 10,
    shadowColor: '#00F0'
  } as TopBarConfig)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [progress, setProgress] = useState(false)

  let network: WalletAdapterNetwork
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('network', 'devnet')
    network = localStorage.getItem('network') as WalletAdapterNetwork
  }
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const endpoint = useMemo(() => clusterApiUrl(network || 'mainnet-beta'), [])

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

  Router.events.on('routeChangeStart', () => setProgress(true))
  Router.events.on('routeChangeComplete', () => setProgress(false))
  TopBarProgress.config(progressBarConfig())

  const onWalletError = useCallback((error: WalletError) => {
    console.log(error, '@walletError')
  }, [])
  return (
    <ModalProvider>
      <ThemeProvider theme={theme()}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false} onError={onWalletError}>
            <WalletModalProvider>
              <SessionProvider session={session}>
                {progress && <TopBarProgress />}
                <Component {...pageProps} />
              </SessionProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </ModalProvider>
  )
}

export default MyApp
