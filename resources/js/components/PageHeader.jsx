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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: config => config.appbar_height + 1,
    width: "100%",
  },
}))

export default React.memo(PageHeader)
