import { Box, CircularProgress } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"

import Menu from "./Main/MainMenu/Menu"
import PageHeader from "./PageHeader"
import PageWithFixedMenu from "./PageWithFixedMenu"

function Page({
  title = "",
  header = false,
  loading = false,
  menu = null,
  menuActions = {},
  content = () => {},
}) {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config)

  return (
    <PageWithFixedMenu
      title={title}
      menu={menu}
      menuActions={menuActions}
      header={() => (
        <>
          {header !== false && header()}
          {header === false && <PageHeader right={() => loading && <CircularProgress size={20} />} />}
        </>
      )}
      content={content}
    />
  )
}

const useStyles = makeStyles(theme => createStyles({
  menu: {
    width: config => config.menu_width,
  },
}))

export default React.memo(Page)
