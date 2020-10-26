import { Box } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import React from "react"

function PageHeader({ left = () => {}, right = () => {} }) {
  const config = useSelector(state => state.app.config),
    classes = useStyles()

  return (
    <Box
      className={classes.root}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Paper
        vaiant="outlined"
        square={true}
        className={classes.paper}
      >
        <Box>{left()}</Box>
        <Box>{right()}</Box>
      </Paper>
    </Box>
  )
}

const useStyles = makeStyles(theme => createStyles({
  root: {

  },

  paper: {
    height: config => config.appbar_height,
  },
}))

export default React.memo(PageHeader)
