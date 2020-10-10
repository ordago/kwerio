import { Box } from "@material-ui/core"
import { Switch, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { endpoints } from "../../routes/app"
import Users from "../Users"
import useStyles from "./index.styles"

function Page() {
  const { settings } = useSelector(state => state.config),
    classes = useStyles(settings)

  return (
    <Box className={classes.root}>
      <Switch>
        <Route exact path={endpoints.account.permissions.users} render={props => (
          <Users {...props} />
        )} />
      </Switch>
    </Box>
  )
}

export default React.memo(Page)
