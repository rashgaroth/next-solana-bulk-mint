import * as React from 'react'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import GrainIcon from '@mui/icons-material/Grain'
import Link from 'next/link'

function handleClick(event) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export default function BreadCrumb({ parent, child }: { parent: string; child: string }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href={'/home'}>
          <Typography sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'underline' }} color="inherit">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Typography>
        </Link>
        <Link href={'/home'}>
          <Typography sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'underline' }} color="inherit">
            <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {parent}
          </Typography>
        </Link>
        <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
          <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {child}
        </Typography>
      </Breadcrumbs>
    </div>
  )
}
