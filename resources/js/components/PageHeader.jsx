import { Box, Paper } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"

function PageHeader({ left = () => {}, right = () => {} }) {
  const config = useSelector(state => state.app.config),
    user = useSelector(state => state.app.user),
    classes = useStyles(config)

  return (
    <Paper
      variant="outlined"
      square={true}
      className={clsx(classes.root, {
        [classes.rootLtr]: user.is_rtl === false,
        [classes.rootRtl]: user.is_rtl,
      })}
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
  },

  rootRtl: {
    marginRight: 1,
    borderLeft: "none",
  },

  rootLtr: {
    marginLeft: 1,
    borderRight: "none",
  },
}))

export default React.memo(PageHeader)
