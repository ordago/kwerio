import { useSelector } from "react-redux"
import React from "react"

import useStyles from "./index.styles"

function Module({ menu, content }) {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config)

  return (
    <div className={classes.root}>
      {menu()}
      {content()}
    </div>
  )
}

export default React.memo(Module)
