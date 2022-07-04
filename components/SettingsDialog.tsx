import { Settings } from '@mui/icons-material'
import { Box, Button, Drawer, Grid, Stack, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ISettingsDialog } from 'interfaces/ISettingsDialog'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSprings, animated } from 'react-spring'

type SolanaTextInput = {
  register: string
  placeholder: string
  a: string
  link: string
  t: string
}

const solanaTextInputList: SolanaTextInput[] = [
  {
    register: 'candyMachineId',
    placeholder: 'Candy Machine Address',
    a: 'How? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/creating-candy-machine',
    t: 'Candy Machine ID'
  },
  {
    register: 'candyMachineStartDate',
    placeholder: 'Candy Machine Start Date',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Start Date (in unixTimestamp)'
  },
  {
    register: 'treasuryAccount',
    placeholder: 'Solana Account',
    a: 'What is that? 🤔',
    link: 'https://docs.metaplex.com/candy-machine-v2/configuration',
    t: 'Solana Treasury Account'
  }
]

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  container: {
    background: `linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
    animation: `$gradient 15s ${theme.transitions.easing.easeInOut} infinite`,
    minHeight: '100vh',
    padding: '4rem 0',
    flex: 1,
    zIndex: 1000,
    backgroundSize: `400% 400%`,
    position: 'relative'
  }
}))

const SolanaForm = () => {
  const { register, handleSubmit } = useForm()
  const [isFocused, setIsFocused] = useState({ focused: false, index: 0 })

  const [springs, api] = useSprings(solanaTextInputList.length, (index) =>
    isFocused.focused
      ? {
          height: 45,
          borderRadius: 8,
          width: 350,
          border: `0px`,
          padding: 10,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false
        }
      : {
          height: 45,
          borderRadius: 8,
          width: 350,
          border: `0px`,
          padding: 10,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false
        }
  )

  const handleOnClick = (index, focus) => {
    setIsFocused({ focused: focus === 1 ? true : false, index })
  }

  useEffect(() => {
    api.start((apiIndex) =>
      isFocused.focused && isFocused.index === apiIndex
        ? {
            height: 45,
            borderRadius: 8,
            width: 350,
            border: `0px`,
            padding: 10,
            scale: 1.1,
            zIndex: 1,
            shadow: 15,
            immediate: (key: string) => key === 'y' || key === 'zIndex'
          }
        : {
            height: 45,
            borderRadius: 8,
            width: 350,
            border: `0px`,
            padding: 10,
            scale: 1,
            zIndex: 0,
            shadow: 1,
            immediate: false
          }
    )
  }, [api, isFocused])

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {springs.map((p, i) => (
        <Stack direction={'column'} spacing={2} key={i}>
          <Typography color="white" mt={2}>
            {solanaTextInputList[i].t}
            {' | '}
            <a href={solanaTextInputList[i].link} target={'_blank'} rel="noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
              {solanaTextInputList[i].a}
            </a>
          </Typography>
          <animated.input
            style={p}
            {...register(solanaTextInputList[i].register)}
            placeholder={solanaTextInputList[i].placeholder}
            onFocus={() => handleOnClick(i, 1)}
            onBlur={() => handleOnClick(i, 0)}
          />
        </Stack>
      ))}
      <Grid container direction="row" alignItems="end" justifyContent={'end'} justifyItems="end">
        <Button
          sx={{
            zIndex: 1000,
            backgroundColor: '#FBA724',
            height: 45,
            borderRadius: 2,
            '&:hover': { backgroundColor: 'darkorange' },
            mt: 2,
            alignSelf: 'end'
          }}
          type="submit">
          <Typography color="white" fontWeight={'bold'}>
            Update
          </Typography>
        </Button>
      </Grid>
    </form>
  )
}

const drawerWidth = 450
export function SettingsDialog({ anchor, toggleDrawer, open }: ISettingsDialog) {
  const classes = useStyles()
  return (
    <React.Fragment key={'aa202'}>
      <Drawer
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(anchor, false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}>
        <Box component={'div'} p={3} className={classes.container}>
          <Stack direction={'column'} spacing={3} alignItems="center" justifyContent={'center'} justifyItems={'center'}>
            <Stack direction={'row'} spacing={2} alignItems="center">
              <Typography component={'div'} variant="h2" color="white" alignItems={'center'}>
                Settings
              </Typography>
              <Settings sx={{ color: 'white' }} />
            </Stack>
            <SolanaForm />
          </Stack>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
