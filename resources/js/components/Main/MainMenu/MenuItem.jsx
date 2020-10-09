import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { useDispatch } from "react-redux"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React from "react"
import clsx from "clsx"

import { expand } from "./index.slice"
import useStyles from "./index.styles"

function MenuItem(props) {
  const { item, hasChildrens, level } = props,
    dispatch = useDispatch(),
    classes = useStyles()

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
          dispatch(expand(item.id))
        }
      }}
    >
      <ListItemIcon><Icon>{item.icon}</Icon></ListItemIcon>
      <ListItemText>{item.text}</ListItemText>
      {hasChildrens && (item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
    </ListItem>
  )
}

export default React.memo(MenuItem)
