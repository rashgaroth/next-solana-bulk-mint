import React, { FC, useCallback } from 'react'
import type { NextComponentType } from 'next'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const ConnectButton: NextComponentType = () => {
  return <WalletMultiButton />
}

export default ConnectButton
