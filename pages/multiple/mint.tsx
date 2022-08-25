/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'

import { Box, Checkbox, Chip, Container, Grid, Snackbar, Stack, Typography } from '@mui/material'
import { Alert } from '@mui/material'
import { AlertState } from 'lib/utils'
import { makeStyles } from '@mui/styles'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { useWallet } from '@solana/wallet-adapter-react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import LoadingBackdrop from 'components/Backdrop'
import AuthLayout from 'layouts/AuthLayout'

const UploaderTab = dynamic(import('components/UploaderTabs'), { ssr: true })

const useStyles = makeStyles((theme: any) => ({
  container: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    zIndex: 1000,
    backgroundSize: `400% 400%`,
    position: 'relative'
  },
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%'
    },
    '50%': {
      backgroundPosition: '100% 50%'
    },
    '100%': {
      backgroundPosition: '0% 50%'
    }
  }
}))

const WhitelistMint = () => {
  const router = useRouter()
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })
  const classes = useStyles()
  const wallet = useWallet()
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const label = { inputProps: { 'aria-label': 'Checkbox Agreement' } }

  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  const onSubmit = async () => {
    setIsLoading(true)
    router.push('/multiple/select-type', undefined, { shallow: false })
  }

  const getPath = async () => {
    try {
      setIsLoading(true)
      const addr = wallet.publicKey.toBase58()
      const data = await fetch(`/api/whitelist/check-cache-config?address=${addr}`)
      if (data.status === 200) {
        const jsonData = await data.json()
        if (jsonData.isExist) {
          router.push('/multiple/home', undefined, { shallow: false })
        }
        if (jsonData.isKeypairExist) {
          router.push('/multiple/select-type', undefined, { shallow: false })
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error(error, '@error get')
    }
  }

  useEffect(() => {
    getPath()
  }, [])

  return (
    <AuthLayout>
      <div className={classes.container}>
        <Container>
          <h1 style={{ color: '#FFF' }}>
            Launch Sugar <Chip label={<p style={{ color: '#FFF' }}>Beta</p>} sx={{ borderRadius: 2, backgroundColor: '#e73c7e' }} />{' '}
          </h1>

          <Grid container direction={'column'}>
            <Grid item>
              <Typography color="white" variant="h2" mb={2}>
                Before you start
              </Typography>
            </Grid>
            <Grid item>
              <div>
                <Head>
                  <title>Preparing</title>
                </Head>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 4,
                    backgroundSize: `400% 400%`,
                    backgroundPosition: '100% 50%',
                    p: 2
                  }}>
                  <h1 style={{ fontWeight: 'bold' }} color="black">
                    The Disclaimers
                  </h1>
                  <div>
                    This process will required the private key that will mint the NFTs, if you using this apps without the conversation
                    between you & <b style={{ color: 'purple' }}>NVP</b>. do not continue! <br />
                    &diams; The <strong style={{ color: 'red' }}>private key</strong> will be displayed as (account).json <br />
                    &diams; The <strong style={{ color: 'red' }}>private key</strong> needs agreement between{' '}
                    <b style={{ color: 'purple' }}>NVP</b> and the user(s) <br />
                    &diams; The <strong style={{ color: 'red' }}>private key</strong> will be encoded to the server and decode it to the
                    client <br />
                    &diams; The <strong style={{ color: 'red' }}>private key</strong> required will be use for mint the NFTs{' '}
                    <code style={{ backgroundColor: 'grey', padding: 2, color: '#FFF', borderRadius: 4 }}>$sugar mint</code> <br />
                  </div>
                  {wallet.connected ? <UploaderTab /> : <h2>Please Connect Wallet ..</h2>}
                  <h1 style={{ fontWeight: 'bold' }} color="black">
                    The Steps
                  </h1>
                  <div>
                    After uploading the <strong style={{ color: 'red' }}>private key</strong>, you need to follow the steps below: <br />
                    1. Create Sugar (Upload config / Create config from the forms). Same as{' '}
                    <code style={{ backgroundColor: 'grey', padding: 2, color: '#FFF', borderRadius: 4 }}>$sugar launch</code> <br />
                    2. Deploy Sugar. Same as{' '}
                    <code style={{ backgroundColor: 'grey', padding: 2, color: '#FFF', borderRadius: 4 }}>$sugar deploy</code> <br />
                    3. After you&apos;ve been deployed the Sugar, you can check your Sugar state (Show sugar, set collection, update){' '}
                    <code style={{ backgroundColor: 'grey', padding: 2, color: '#FFF', borderRadius: 4 }}>
                      $sugar {`{SUBCOMMAND}`}
                    </code>{' '}
                    <a
                      href="https://docs.metaplex.com/tools/sugar/commands"
                      target={'_blank'}
                      rel="noreferrer"
                      style={{ color: 'blueviolet', textDecoration: 'underline' }}>
                      Read more
                    </a>{' '}
                    <br />
                    4. Delete or Remove your <strong style={{ color: 'red' }}>private key</strong>
                  </div>
                  <Stack direction={'row'} spacing={0} alignItems="center">
                    <Checkbox {...label} onChange={handleChange} />
                    <p>I Agree with all the risk</p>
                  </Stack>
                  <LoadingButton loading={isLoading} disabled={!checked} sx={{ bgcolor: 'primary.main', color: '#FFF' }} onClick={onSubmit}>
                    Submit
                  </LoadingButton>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Container>
        <LoadingBackdrop open={isLoading} handleClose={undefined} />
        <Snackbar
          open={alertState.open}
          autoHideDuration={alertState.hideDuration === undefined ? 6000 : alertState.hideDuration}
          onClose={() => setAlertState({ ...alertState, open: false })}>
          <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
            {alertState.message}
          </Alert>
        </Snackbar>
      </div>
    </AuthLayout>
  )
}

export default WhitelistMint
