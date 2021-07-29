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
import React, { useEffect, useState } from "react"

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
    t = useT()

  if (!menu) menu = "module.menu"

  const state = useSelector(state => state)

  if (!_.hasIn(state, menu)) {
    console.error(`State does not have the following path ${menu}`)
    return []
  }

  const menu_items = get(state, menu)

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
          selected={("link" in list) && list.link === match.path}
          onClick={() => _handle_click(list)}
        >
          {list.icon && (
            <ListItemIcon><Icon>{list.icon}</Icon></ListItemIcon>
          )}
          <ListItemText primary={t(list.text)} />
          {("children" in list) && list.children.length > 0 && (
            <>
              {list.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </>
          )}
        </ListItem>
        {("children" in list) && list.children.length > 0 && (
          <Collapse in={list.open} timeout="auto" unmountOnExit>
            {list.children.map(item => (
              <ListItem
                key={item.id}
                button
                onClick={() => _handle_click(item)}
                className={classes.nested}
                selected={("link" in item) && item.link === match.path}
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
              {("children" in list) && list.children.length > 0 && list.children.map(item => _render_list(item))}
            </List>
          )}
          {!("is_header" in list) && _render_list(list)}
        </React.Fragment>
      ))}
    </List>
  )
}

export default React.memo(PageMenu)
