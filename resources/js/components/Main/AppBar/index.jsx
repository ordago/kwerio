import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Toolbar,
  useTheme,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import MenuIcon from "@mui/icons-material/Menu"
import React, { useState } from "react"

import { actions } from "../../../App.slice"
import { endpoints } from "../../../routes"
import useStyles from "./index.styles"

function AppBar() {
  const classes = useStyles(),
    theme = useTheme(),
    dispatch = useDispatch(),
    [anchorEl, setAnchorEl] = useState(null),
    history = useHistory(),
    state = useSelector(state => state.app)

  return (
    <MuiAppBar position="fixed" className={classes.root} enableColorOnDark>
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
          {/* TOGGLE BRIGHTNESS */}
          <Box mr={2}>
            <IconButton color="inherit" onClick={() => dispatch(actions.toggleBrightness())}>
              {state.theme.palette.type === "light" && (
                <Brightness4Icon />
              )}
              {state.theme.palette.type === "dark" && (
                <Brightness7Icon />
              )}
            </IconButton>
          </Box>

          {/* USER AVATAR */}
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
