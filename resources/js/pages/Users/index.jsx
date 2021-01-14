import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter } from "./index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"
import useUser from "../../hooks/useUser"

function Users({ match }) {
  const classes = useStyles(),
    state = useSelector(state => state.users),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    loading = useSelector(state => state.users.loading),
    user = useUser()

  return (
    <Page
      loading={loading}
      title={t("Users")}
      menu="app.permissionsMenu"
      menuActions={appActions}
      content={() => (
        <Paper>
          {user.canAny(["root/user_list", "root/user_create", "root/user_update"]) && (
            <PaginatedTable
              toolbar
              canSearch={user.can("root/user_list")}
              canCreate={user.can("root/user_create")}
              reducer="users"
              adapter={adapter}
              api={api.users}
              endpoint={endpoints.users}
              actions={actions}
              onRowClick={item => history.push(endpoints.users.update.replace(/:uuid/, item.uuid))}
            />
          )}
        </Paper>
      )}
    />
  )
}

export default React.memo(Users)
