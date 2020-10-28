import {
  Box,
  Collapse,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React, { useState } from "react"

function AccountMenu({ match }) {
  const items = useSelector(state => state.app.menu.data).filter(item => item.text === "Account"),
    classes = useStyles(),
    [opens, setOpens] = useState({}),
    history = useHistory()

  function _set_opens(id) {
    setOpens({
      ...opens,
      [id]: !((id in opens) && opens[id]),
    })
  }

  function _is_open(childrens) {
    for (let i = 0; i < childrens.length; i ++) {
      if (match.path.startsWith(childrens[i].link)) {
        return true
      }
    }

    return false
  }

  return (
    <>
      {items.map(item => (
        <List
          key={item.id}
          disablePadding={true}
          subheader={<ListSubheader>{item.text.toUpperCase()}</ListSubheader>}
        >
          {item.children.map(child => (
            <Box key={child.id}>
              <ListItem button onClick={() => _set_opens(child.id)}>
                {("icon" in child) && <ListItemIcon><Icon>{child.icon}</Icon></ListItemIcon>}
                <ListItemText>{child.text}</ListItemText>
                {("children" in child) && (opens[child.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListItem>

              <Collapse
                timeout="auto"
                in={
                  ((child.id in opens) && opens[child.id])
                  || (!(child.id in opens) && ("children" in child) && _is_open(child.children))
                }
                unmountOnExit
              >
                <List disablePadding>
                  {("children" in child) && child.children.map(sub => (
                    <ListItem
                      key={sub.id}
                      button
                      selected={match.path.startsWith(sub.link)}
                      className={classes.nested}
                      onClick={() => history.push(sub.link)}
                    >
                      <ListItemIcon><Icon>{sub.icon}</Icon></ListItemIcon>
                      <ListItemText>{sub.text}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      ))}
    </>
  )
}

const useStyles = makeStyles(theme => createStyles({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

export default React.memo(AccountMenu)
