import { Icon, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import React from "react"
import clsx from "clsx"

import { actions } from "../../../App.slice"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"

function MenuItem(props) {
  const { item, hasChildrens, level } = props,
    dispatch = useDispatch(),
    classes = useStyles(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  const renderLink = React.useMemo(() => (
      React.forwardRef((itemProps, ref) => (
        <a href={item.link} ref={ref} {...itemProps} />
      ))
  ), [item.link])

  return (
    <ListItem
      key={item.id}
      button
      component={renderLink}
      dense={true}
      className={clsx({ [classes.nestedListItem]: level > 0 })}
      onClick={() => {
        if (hasChildrens) {
          dispatch(actions.expandMenu(item.id))
        }
      }}
    >
      <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
      <ListItemText>{t(item.text)}</ListItemText>
      {hasChildrens && (item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
    </ListItem>
  )
}

export default React.memo(MenuItem)
