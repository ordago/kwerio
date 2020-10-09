import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  useTheme,
} from "@material-ui/core"
import { useDispatch } from "react-redux"
import MenuIcon from "@material-ui/icons/Menu"
import React from "react"

import { toggle as toggleMenu } from "../MainMenu/index.slice"
import useStyles from "./index.styles"

function AppBar() {
  const classes = useStyles(),
    theme = useTheme(),
    dispatch = useDispatch()

  return (
    <MuiAppBar position="fixed" className={classes.root}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <IconButton
            edge="start"
            className={classes.menuIconBtn}
            color="inherit"
            onClick={() => dispatch(toggleMenu())}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div className={classes.toolbarRight}></div>
      </Toolbar>
    </MuiAppBar>
  )
}

export default React.memo(AppBar)
