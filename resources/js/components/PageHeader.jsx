import { Box, Paper } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"

function PageHeader({ left = () => {}, right = () => {} }) {
  const config = useSelector(state => state.app.config),
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
    width: config => `calc(100% - ${config.menu_width + 1}px)`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    zIndex: theme.zIndex.appBar - 1,
    marginLeft: 1,
  },
}))

export default React.memo(PageHeader)
