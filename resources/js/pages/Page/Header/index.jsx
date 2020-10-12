import { Box, Divider, Typography } from "@material-ui/core"
import { useSelector } from "react-redux"
import React from "react"

import useStyles from "./index.styles"

function Header({ children, title = "" }) {
  const { settings } = useSelector(state => state.config),
    classes = useStyles(settings)

  return (
    <Box className={classes.root} display="flex" alignItems="center">
      <Typography className={classes.title}>{title}</Typography>
      <Divider orientation="vertical" />

      {children}
    </Box>
  )
}

export default React.memo(Header)
