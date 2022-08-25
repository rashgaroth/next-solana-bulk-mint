import { Chip, Skeleton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from 'styles/Home.module.css'
import { LazyNft, Metaplex, Nft } from '@metaplex-foundation/js'
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'
import { candyMachineConfig } from 'config/candyMachine'

{
  /* <Stack direction="row" spacing={1} alignItems="center">
<div style={{ borderRadius: 8, overflow: 'hidden', height: 25, width: 25, position: 'relative' }}>
  <Image src="/assets/images/magic-eden-logo.webp" layout="fixed" objectFit="cover" alt="nft-image" height={25} width={25} />
</div>
<Typography sx={{ color: 'hsla(0, 3%, 40%, 0.928)', cursor: 'pointer', '&:hover': { color: '#DD3CB0' } }}>
  See on Magic Eden
</Typography>
</Stack> */
}

const connection = new Connection(clusterApiUrl(candyMachineConfig.network as Cluster))
const metaplex = new Metaplex(connection)

type NftCardType = {
  isLoading: boolean
  nft: Nft
}

const NftCard = ({ isLoading = false, nft }: NftCardType) => {
  const getNft = async () => {
    const candyMachineAddress = new PublicKey('7UEZcCVFqMiL7yaerMqc8XYWMBQXaeY5MmpgbcoeT1Ey')
    const detail = await metaplex.candyMachines().findMintedNfts(candyMachineAddress).run()
    const jsonUri = await (await fetch(detail[0].uri)).json()
    console.log(jsonUri, '@jsonUri?')
    console.log(detail)
  }

  useEffect(() => {
    getNft()
  }, [])

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 4,
        height: 347,
        width: 270,
        p: 2,
        boxShadow: `0px 0px 10px 0px #000`,
        position: 'relative'
      }}>
      {isLoading ? (
        <Stack direction="column" spacing={1}>
          <Skeleton variant="rectangular" width={'100%'} height={200} sx={{ borderRadius: 4 }} />
          <Skeleton variant="text" />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" />
        </Stack>
      ) : (
        <Stack direction={'column'} spacing={1}>
          <div style={{ borderRadius: 8, overflow: 'hidden', height: 200, width: '100%' }}>
            <Chip
              label={<Typography sx={{ color: '#FFF', cursor: 'pointer', '&:hover': { color: '#DD3CB0' } }}>Listed</Typography>}
              variant="filled"
              sx={{
                position: 'absolute',
                left: 27,
                top: 27,
                zIndex: 1000,
                borderRadius: 2,
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'background.default' }
              }}
            />
            <Image
              loader={() => nft.json.image}
              src={nft.json.image}
              layout="fixed"
              objectFit="cover"
              alt="nft-image"
              height={200}
              width={270}
            />
          </div>
          <Typography sx={{ color: 'black', fontFamily: 'Boldenvan' }}>{nft.name}</Typography>
          <Typography sx={{ color: 'hsla(0, 3%, 40%, 0.928)' }}>{nft.json.description}</Typography>
          <Stack direction="row" alignItems={'center'} justifyContent="space-between">
            <Typography>Edition Nonce</Typography>
            <Typography fontWeight={'bold'}>{nft.editionNonce}</Typography>
          </Stack>
          <Stack direction="row" alignItems={'center'} justifyContent="space-between">
            <Typography>Symbol</Typography>
            <Typography fontWeight={'bold'}>{nft.symbol}</Typography>
          </Stack>
        </Stack>
      )}
    </Box>
  )
}

const HorizontalSlider = () => {
  const wallet = useWallet()
  const [nfts, setNfts] = useState<Nft[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getMetaplexState = async () => {
    try {
      const loadedNft = localStorage.getItem('loaded_nft')
      if (loadedNft !== null) {
        const getMpxData: Nft[] = JSON.parse(loadedNft)
        setNfts(getMpxData)
      } else {
        setIsLoading(true)
        const nfts = await metaplex.nfts().findAllByCreator(wallet.publicKey).run()
        if (nfts.length > 0) {
          const promiseArray: Nft[] = []
          for (let i = 0; i < nfts.length; i++) {
            promiseArray.push(
              await metaplex
                .nfts()
                .loadNft(nfts[i] as LazyNft)
                .run()
            )
          }
          const data = await Promise.all(promiseArray)
          const stringifyData: string = JSON.stringify(data)
          localStorage.setItem('loaded_nft', stringifyData)
          setNfts(data)
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error, '@errorGetMetaplexState')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMetaplexState()
  }, [])
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: '35%'
      }}>
      <Stack direction="column" spacing={2}>
        <h1 className={styles.nftListTypography}>Collections</h1>
        <Box
          className={styles.horizontalScroll}
          sx={{
            backgroundColor: 'transparent',
            p: 2,
            overflowX: 'scroll',
            maxWidth: 670,
            borderRadius: 4,
            px: 4
          }}>
          <div style={{ position: 'relative' }}>
            <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
              {nfts.map((x, i) => (
                <NftCard isLoading={isLoading} nft={x} key={i} />
              ))}
            </Stack>
          </div>
        </Box>
      </Stack>
    </div>
  )
}

export default HorizontalSlider
