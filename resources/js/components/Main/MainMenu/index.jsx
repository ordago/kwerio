import { Collapse, SwipeableDrawer } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import React from "react"

import { toggle } from "./index.slice"
import Menu from "./Menu"
import useStyles from "./index.styles"

function MainMenu() {
  const { open } = useSelector((state) => state.mainMenu),
    settings = useSelector((state) => state.config.settings),
    dispatch = useDispatch(),
    classes = useStyles(settings)

  function inner_toggle(dispatch) {
    return function(evt) {
      if (evt && evt.type === 'keydown' && (evt.key === "Tab" || evt.key === "Shift")) return
      dispatch(toggle())
    }
  }

  return (
    <Collapse in={open}>
      <SwipeableDrawer
        open={open}
        anchor="left"
        onClose={inner_toggle(dispatch)}
        onOpen={inner_toggle(dispatch)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Menu />
      </SwipeableDrawer>
    </Collapse>
  )
}

export default React.memo(MainMenu)
