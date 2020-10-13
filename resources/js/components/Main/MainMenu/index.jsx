import { Collapse, SwipeableDrawer } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import React from "react"

import { toggle } from "./index.slice"
import Menu from "./Menu"
import useStyles from "./index.styles"
import { actions } from '../../../App.slice.js'

function MainMenu() {
  const { open } = useSelector((state) => state.app.menu),
    config = useSelector((state) => state.app.config),
    classes = useStyles(config),
    dispatch = useDispatch()

  function inner_toggle(dispatch) {
    return function(evt) {
      if (evt && evt.type === 'keydown' && (evt.key === "Tab" || evt.key === "Shift")) return
      dispatch(actions.toggleMenu())
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
