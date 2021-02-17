import {
  Collapse,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"
import { useRouteMatch, useHistory } from "react-router-dom"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React, { useState } from "react"

import { get } from "lodash"

import useT from "../hooks/useT"

const useStyles = makeStyles(theme => createStyles({
  parent: {
    height: config => `calc(100% - ${config.appbar_height}px)`,
    overflowX: "auto",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

function PageMenu({ menu = null, actions }) {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config),
    match = useRouteMatch(),
    history = useHistory(),
    dispatch = useDispatch(),
    t = useT(),
    [first_render, setFirstRender] = useState(true)

  if (!menu) menu = "module.menu"

  const state = useSelector(state => state)

  if (!_.hasIn(state, menu)) {
    console.error(`State does not have the following path ${menu}`)
    return []
  }

  const menu_items = get(state, menu)

  /**
   * Check if menu is selected or not based on the url path.
   */
  function _is_menu_selected(item) {
    if (("link" in item) && ("matches" in item)) {
      const matches = item.matches.indexOf(match.path) !== -1

      if (first_render) {
        dispatch(actions.openParentOf({ menu, item }))

        setFirstRender(false)
      }

      return matches
    }

    return ("link" in item) && item.link === match.path
  }

  /**
   * Handle menu item click.
   */
  function _handle_click(item) {
    if ("open" in item) {
      dispatch(actions.toggleMenu({ menu, item }))
    }

    if (("link" in item) && item.link !== "#") {
      history.push(item.link)
    }
  }

  /**
   * Render menu list.
   */
  function _render_list(list) {
    return (
      <React.Fragment key={list.id}>
        <ListItem
          button
          selected={_is_menu_selected(list)}
          onClick={() => _handle_click(list)}
        >
          {list.icon && (
            <ListItemIcon><Icon>{list.icon}</Icon></ListItemIcon>
          )}
          <ListItemText primary={t(list.text)} />
          {("children" in list) && (
            <>
              {list.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          )}
        </ListItem>
        {("children" in list) && (
          <Collapse in={list.open} timeout="auto" unmountOnExit>
            {list.children.map(item => (
              <ListItem
                key={item.id}
                button
                onClick={() => _handle_click(item)}
                className={classes.nested}
                selected={_is_menu_selected(item)}
              >
                {item.icon && (
                  <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
                )}
                <ListItemText primary={t(item.text)} />
              </ListItem>
            ))}
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return (
    <List component="div" className={classes.parent}>
      {menu_items.map(list => (
        <React.Fragment key={list.id}>
          {("is_header" in list) && (
            <List subheader={("is_header" in list) && <ListSubheader>{t(list.text)}</ListSubheader>}>
              {("children" in list) && list.children.map(item => _render_list(item))}
            </List>
          )}
          {!("is_header" in list) && _render_list(list)}
        </React.Fragment>
      ))}
    </List>
  )
}

export default React.memo(PageMenu)
