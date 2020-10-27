import { Box } from "@material-ui/core"
import { Switch, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { endpoints } from "../../routes/app"
import useStyles from "./index.styles"
import Suspense from '../../components/Suspense'

const Groups = React.lazy(() => import("../Groups")),
  GroupsUpsert = React.lazy(() => import("../Groups/Upsert")),
  Modules = React.lazy(() => import("../Modules")),
  Users = React.lazy(() => import("../Users")),
  UsersUpsert = React.lazy(() => import("../Users/Upsert")),
  Account = React.lazy(() => import("../Account")),
  Profile = React.lazy(() => import("../Profile"))

function Page() {
  const config = useSelector(state => state.app.config),
    classes = useStyles(config)

  console.log("called")

  return (
    <Box className={classes.root}>
      <Switch>

        {/* OTHERS */}
        <Route exact path={endpoints.profile.index} render={props => <Suspense component={<Profile {...props} />} />} />

        {/* ACCOUNT / PERMISSIONS */}
        <Route exact path={endpoints.groups.create} render={props => <Suspense component={<GroupsUpsert {...props} />} />} />
        <Route exact path={endpoints.groups.index} render={props => <Suspense component={<Groups {...props} />} />} />
        <Route exact path={endpoints.groups.update} render={props => <Suspense component={<GroupsUpsert {...props} />} />} />
        <Route exact path={endpoints.modules.index} render={props => <Suspense component={<Modules {...props} />} />} />
        <Route exact path={endpoints.users.create} render={props => <Suspense component={<UsersUpsert {...props} />} />} />
        <Route exact path={endpoints.users.update} render={props => <Suspense component={<UsersUpsert {...props} />} />} />
        <Route exact path={endpoints.users.index} render={props => <Suspense component={<Users {...props} />} />} />

        {/* ACCOUNT / SETTINGS */}
        <Route exact path={endpoints.account.index} render={props => <Suspense component={<Account {...props} />} />} />

      </Switch>
    </Box>
  )
}

export default React.memo(Page)
