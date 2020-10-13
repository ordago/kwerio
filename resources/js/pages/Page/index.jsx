import { Box } from "@material-ui/core"
import { Switch, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { endpoints } from "../../routes/app"
import Groups from "../Groups"
import Modules from "../Modules"
import UpdateOrCreateGroup from "../Groups/UpdateOrCreate"
import Users from "../Users"
import useStyles from "./index.styles"

function Page() {
  const { settings } = useSelector(state => state.config),
    classes = useStyles(settings)

  return (
    <Box className={classes.root}>
      <Switch>
        <Route exact path={endpoints.groups.index} render={props => <Groups {...props} />} />
        <Route exact path={endpoints.groups.create} render={props => <UpdateOrCreateGroup {...props} />} />
        <Route exact path={endpoints.users.index} render={props => <Users {...props} />} />
        <Route exact path={endpoints.modules.index} render={props => <Modules {...props} />} />
      </Switch>
    </Box>
  )
}

export default React.memo(Page)
