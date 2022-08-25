import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Settings from '@mui/icons-material/Settings'
import { Festival, Palette, PrecisionManufacturing } from '@mui/icons-material'

export default function HomeMenu({ open, handleClose, anchorEl, onClickSetting, onClickCreateCandyMachine, onClickAccount, onClickSugar }) {
  return (
    <React.Fragment>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: 'background.default',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: '50%',
              width: 10,
              height: 10,
              bgcolor: 'background.default',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={onClickAccount}>
          <ListItemIcon>
            <Palette fontSize="small" />
          </ListItemIcon>
          Set Theme (Coming Soon)
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={onClickCreateCandyMachine}>
          <ListItemIcon>
            <PrecisionManufacturing fontSize="small" />
          </ListItemIcon>
          Create Candy Machine (Coming Soon)
        </MenuItem>
        <MenuItem onClick={onClickSugar}>
          <ListItemIcon>
            <Festival fontSize="small" />
          </ListItemIcon>
          Setup your Sugar (Beta!)
        </MenuItem> */}
        <MenuItem onClick={onClickSetting}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
