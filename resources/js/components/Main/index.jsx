import React from "react"

import AppBar from "./AppBar"
import MainMenu from "./MainMenu"
import useStyles from "./index.styles"

function Main({ children }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar />
      <MainMenu />
      {children}
    </div>
  )
}

export default React.memo(Main)
