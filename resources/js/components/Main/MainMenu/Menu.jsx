import { Collapse, List, ListSubheader } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import _ from "lodash"

import MenuItem from "./MenuItem"
import useStyles from "./Menu.styles"

function Menu({
  only = false,
  hasLogo = true,
}) {
  const { data } = useSelector((state) => state.app.menu),
    config = useSelector((state) => state.app.config),
    classes = useStyles(config),
    dispatch = useDispatch()

  return (
    <div className={classes.root}>
      {hasLogo && <div className={classes.logo}></div>}
      {data.map((menu) => {
        if (only !== false && only.indexOf(menu.text) === -1) {
          return []
        }

        return (
          <List key={menu.id} dense={true} disablePadding={true} subheader={
            <ListSubheader>{menu.text.toUpperCase()}</ListSubheader>
          }>
            {menu.children.map((item) => {
              let node = []
              let has_childrens = !_.isUndefined(item.children) && item.children.length > 0

              node.push(<MenuItem key={item.id} hasChildrens={has_childrens} item={item} level={0} />)

              if (has_childrens) {
                node.push(
                  <Collapse key={`${item.id}${item.id}`} timeout="auto" in={item.open} unmountOnExit>
                    <List disablePadding>
                      {item.children.map((item) => (
                        <MenuItem hasChildrens={false}  key={item.id} item={item} level={1} />
                      ))}
                    </List>
                  </Collapse>
                )
              }

              return node
            })}
          </List>
        )
      })}
    </div>
  )
}

export default React.memo(Menu)
