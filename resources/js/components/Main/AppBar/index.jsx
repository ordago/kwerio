import {
  Avatar,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar,
  useTheme,
} from "@material-ui/core"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import MenuIcon from "@material-ui/icons/Menu"
import React, { useState } from "react"

import { actions } from "../../../App.slice"
import { endpoints } from "../../../routes"
import useStyles from "./index.styles"

function AppBar() {
  const classes = useStyles(),
    theme = useTheme(),
    dispatch = useDispatch(),
    [anchorEl, setAnchorEl] = useState(null),
    history = useHistory()

  return (
    <MuiAppBar position="fixed" className={classes.root}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <IconButton
            edge="start"
            className={classes.menuIconBtn}
            color="inherit"
            onClick={() => dispatch(actions.toggleMainMenu())}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div className={classes.toolbarRight}>
          <ButtonBase onClick={e => setAnchorEl(e.currentTarget)}>
            <Avatar className={classes.avatar} />
          </ButtonBase>

          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => {
              setAnchorEl(null)
              history.push(endpoints.profile.index)
            }}>
              Profile
            </MenuItem>

            <MenuItem onClick={() => {
              setAnchorEl(null)
              window.location.href = endpoints.logout
            }}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </MuiAppBar>
  )
}

export default React.memo(AppBar)
