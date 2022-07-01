/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@blocto/sdk'])
module.exports = withTM({
  reactStrictMode: true,
  webpack5: true,
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
  env: {
    NEXT_CANDY_MACHINE_CONFIG: process.env.NEXT_CANDY_MACHINE_CONFIG,
    NEXT_CANDY_MACHINE_ID: process.env.NEXT_CANDY_MACHINE_ID,
    NEXT_TREASURY_ADDRESS: process.env.NEXT_TREASURY_ADDRESS,
    NEXT_CANDY_START_DATE: process.env.NEXT_CANDY_START_DATE,
    NEXT_SOLANA_NETWORK: process.env.NEXT_SOLANA_NETWORK,
    NEXT_SOLANA_RPC_HOST: process.env.NEXT_SOLANA_RPC_HOST
  }
})
