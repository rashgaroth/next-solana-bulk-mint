/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@blocto/sdk',
  '@project-serum/sol-wallet-adapter',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-bitkeep',
  '@solana/wallet-adapter-bitpie',
  '@solana/wallet-adapter-blocto',
  '@solana/wallet-adapter-clover',
  '@solana/wallet-adapter-coin98',
  '@solana/wallet-adapter-coinhub',
  '@solana/wallet-adapter-ledger',
  '@solana/wallet-adapter-mathwallet',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-safepal',
  '@solana/wallet-adapter-slope',
  '@solana/wallet-adapter-solflare',
  '@solana/wallet-adapter-sollet',
  '@solana/wallet-adapter-solong',
  '@solana/wallet-adapter-tokenpocket',
  '@solana/wallet-adapter-torus',
  '@solana/wallet-adapter-wallets'
])

const { env } = process
const environment = {
  NEXT_CANDY_MACHINE_CONFIG: process.env.NEXT_CANDY_MACHINE_CONFIG,
  NEXT_CANDY_MACHINE_ID: process.env.NEXT_CANDY_MACHINE_ID,
  NEXT_TREASURY_ADDRESS: process.env.NEXT_TREASURY_ADDRESS,
  NEXT_CANDY_START_DATE: process.env.NEXT_CANDY_START_DATE,
  NEXT_SOLANA_NETWORK: process.env.NEXT_SOLANA_NETWORK,
  NEXT_SOLANA_RPC_HOST: process.env.NEXT_SOLANA_RPC_HOST,
  NEXT_FIREBASE_API_KEY: env.NEXT_FIREBASE_API_KEY,
  NEXT_FIREBASE_AUTH_DOMAIN: env.NEXT_FIREBASE_AUTH_DOMAIN,
  NEXT_FIREBASE_PROJECT_ID: env.NEXT_FIREBASE_PROJECT_ID,
  NEXT_FIREBASE_STORAGE_BUCKET: env.NEXT_FIREBASE_STORAGE_BUCKET,
  NEXT_FIREBASE_MESSAGING_SENDER_ID: env.NEXT_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_FIREBASE_APP_ID: env.NEXT_FIREBASE_APP_ID,
  NEXT_FIREBASE_MEASUREMENT_ID: process.env.NEXT_FIREBASE_MEASUREMENT_ID
}
module.exports = withTM({
  reactStrictMode: true,
  webpack5: true,
  images: {
    loader: 'akamai',
    path: ''
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      stream: false
    }
    return config
  },
  compiler: {
    styledComponents: true
  },
  env: environment
})
