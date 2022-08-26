/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CardMedia, Grid, Typography } from '@mui/material'
import type { NextApiResponse, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { makeStyles } from '@mui/styles'
import ConnectButton from '../components/ConnectButton'
import AuthLayout from 'layouts/AuthLayout'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(() => ({
  container: {
    padding: '0 5rem',
    backgroundColor: 'linear-gradient(#FFAA5B, #FFB28A)',
    zIndex: -2
  },
  trees: {
    zIndex: -1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    filter: 'blur(4px)'
  },
  main: {
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }
}))

interface ILoginResponse extends NextApiResponse {
  nonce: string
}

const LoginPage: NextPage = () => {
  const classes = useStyles()
  // const { publicKey } = useWallet()
  // const routes = useRouter()

  // const fetchNonce = async (): Promise<ILoginResponse> => {
  //   try {
  //     const response = await fetch('/api/login')

  //     if (response.status != 200) throw new Error('nonce could not be retrieved')

  //     const { nonce } = await response.json()

  //     return nonce
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }

  // const signWallet = async () => {
  //   try {
  //     const session = await getSession()
  //     const nonce = await fetchNonce()
  //     if (!session?.user) {
  //       const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`
  //       const encodedMessage = new TextEncoder().encode(message)
  //       const signedMessage = await (window as any).solana.request({
  //         method: 'signMessage',
  //         params: {
  //           message: encodedMessage
  //         }
  //       })
  //       const res = await signIn('credentials', {
  //         publicKey: signedMessage.publicKey,
  //         signature: signedMessage.signature,
  //         redirect: false,
  //         callbackUrl: `${(window as any).location.origin}/home?pk=${signedMessage.publicKey}`
  //       })
  //       if (res.ok) {
  //         routes.push(`${(window as any).location.origin}/home?pk=${signedMessage.publicKey}`, undefined, { shallow: false })
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err, '@error')
  //     throw new Error(err)
  //   }
  // }

  // useEffect(() => {
  //   if (publicKey) {
  //     signWallet()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [publicKey])

  return (
    <AuthLayout>
      <Head>
        <title>Duck Goes Places</title>
        <meta name="description" content="NFTs Generator for Duck Goes Places" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component={'div'} className={classes.trees}>
        <CardMedia component={'img'} src="/assets/images/trees.svg" />
      </Box>
      <Box className={classes.container}>
        <Box component={'main'} className={classes.main}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '50vh', minWidth: '30vh', maxWidth: '50vh' }}
            sx={{ bgcolor: 'primary.light', borderRadius: 4, p: 2 }}>
            <Grid item>
              <Typography component={'div'} variant="h1" fontWeight="bold" color="white">
                Welcome To DGP Mint!
              </Typography>
            </Grid>
            <Grid item>
              <Typography component={'div'} color="white" textAlign={'center'}>
                Please connect your wallet, if you already have a phantom wallet with your authorization account, you can connect to this
                website
              </Typography>
            </Grid>
            <Grid item mt={3} mb={3}>
              <Image src={'/assets/images/logo.svg'} alt="logo" width={100} height={100} objectFit="fill" />
            </Grid>
            <Grid item>
              <ConnectButton />
            </Grid>
            {/* <Grid item>
              <Button onClick={seed}>Firebase</Button>
            </Grid> */}
          </Grid>
        </Box>
      </Box>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </AuthLayout>
  )
}

export default LoginPage
