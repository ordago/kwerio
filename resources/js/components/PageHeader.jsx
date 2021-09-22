import { Box, Paper } from "@mui/material"
import { makeStyles, createStyles } from "@mui/styles"
import { useSelector } from "react-redux"
import React from "react"
import clsx from "clsx"

function PageHeader({
  left = () => {},
  right = () => {},
}) {
  const config = useSelector(state => state.app.config),
    user = useSelector(state => state.app.user),
    classes = useStyles(config)

  return (
    <Paper
      variant="outlined"
      square={true}
      className={classes.root}
    >
      <Box>{left()}</Box>
      <Box>{right()}</Box>
    </Paper>
  )
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: config => config.appbar_height,
    width: config => `calc(100% - ${config.menu_width}px)`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    zIndex: theme.zIndex.appBar - 1,
    borderRight: "none",
  },
}))

export default React.memo(PageHeader)
