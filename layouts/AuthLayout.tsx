/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSession } from 'next-auth/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const wallet = useWallet()
  const router = useRouter()

  useEffect(() => {
    const loginPath = router.asPath === '/'
    const homePath = router.asPath === '/home'
    if (loginPath || homePath) {
      if (wallet.connected) {
        router.push('/home', undefined, { shallow: false })
      } else {
        router.push('/', undefined, { shallow: false })
      }
    }
    if (!wallet.connected) {
      router.push('/', undefined, { shallow: false })
    }
  }, [wallet.connected])

  return <div>{children}</div>
}

export default AuthLayout
