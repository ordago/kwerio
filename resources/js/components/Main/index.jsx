import { Box } from "@material-ui/core"
import { useSelector } from "react-redux"
import React from "react"

import AppBar from "./AppBar"
import MainMenu from "./MainMenu"
import useStyles from "./index.styles"

function Main({ children }) {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config)

  return (
    <div className={classes.root}>
      <AppBar />
      <MainMenu />
      <Box className={classes.box}>
        {children}
      </Box>
    </div>
  )
}

export default React.memo(Main)
