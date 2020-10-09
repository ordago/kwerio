import { useSelector } from "react-redux"
import React from "react"

import useStyles from "./index.styles"

function Module({ menu, content }) {
  const { settings } = useSelector(state => state.config),
    classes = useStyles(settings)

  return (
    <div className={classes.root}>
      {menu()}
      {content()}
    </div>
  )
}

export default React.memo(Module)
