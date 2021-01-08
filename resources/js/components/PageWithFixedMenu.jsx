import { Box, Divider, Paper, Typography } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"
import clsx from "clsx"

import PageMenu from "./PageMenu"

function PageWithFixedMenu({
  title = false,
  menu = null,
  menuActions = {},
  header = false,
  content = () => {},
}) {
  const config = useSelector(state => state.app.config),
    user = useSelector(state => state.app.user),
    classes = useStyles(config)

  return (
    <Box display="flex" width={1}>
      <Paper
        variant="outlined"
        square={true}
        className={classes.paper}
      >
        {title && (
          <>
            <Typography className={classes.typography} variant="h6">{title}</Typography>
            <Divider className={classes.divider} />
          </>
        )}
        <PageMenu menu={menu} actions={menuActions} />
      </Paper>

      <Box
        width={1}
        className={clsx(classes.content, {
          [classes.contentLtr]: user.is_rtl === false,
          [classes.contentRtl]: user.is_rtl,
        })}
      >
        {header && header()}
        <Box
          p={2}
          className={clsx({
            [classes.contentWithFixedHeader]: header !== false,
            [classes.contentHeight]: header === false,
            [classes.contentHeightMinusHeader]: header !== false,
          })}
        >
          {content()}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles(theme => createStyles({
  root: {

  },

  paper: {
    height: config => `calc(100vh - ${config.appbar_height}px)`,
    width: config => config.menu_width + 1,
    position: "fixed",
    borderLeft: "none",
  },

  typography: {
    textAlign: "center",
    margin: 0,
    padding: 0,
    height: config => config.appbar_height - 2,
    lineHeight: config => `${config.appbar_height - 2}px`,
  },

  divider: {
    margin: 0,
  },

  menu: {
    width: config => config.menu_width,
  },

  content: {
    width: config => `calc(100% - ${config.menu_width}px)`,
    minHeight: config => window.innerHeight - config.appbar_height,
  },

  contentLtr: {
    marginLeft: config => config.menu_width,
  },

  contentRtl: {
    marginRight: config => config.menu_width,
  },

  contentWithFixedHeader: {
    marginTop: config => config.appbar_height,
  },

  contentHeight: {
    height: "100%",
  },

  contentHeightMinusHeader: {
    height: config => `calc(100% - ${config.appbar_height}px)`,
  },
}))

export default React.memo(PageWithFixedMenu)
