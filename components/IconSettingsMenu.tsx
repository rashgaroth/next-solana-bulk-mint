import * as React from 'react'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Delete, Logout } from '@mui/icons-material'
import { useWallet } from '@solana/wallet-adapter-react'

export default function IconSettingsMenu() {
  const wallet = useWallet()

  const logout = async () => {
    await wallet.disconnect()
  }

  return (
    <Paper sx={{ width: 320, maxWidth: '100%', bgcolor: 'white' }}>
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'red' }}>Delete Private Key</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  )
}
