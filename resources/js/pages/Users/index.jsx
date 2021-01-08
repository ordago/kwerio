import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter, tableAsyncActions } from "./index.slice"
import { endpoints } from "../../routes"
import AccountMenu from "../../components/Menus/AccountMenu"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"
import useUser from "../../hooks/useUser"
import { actions as appActions } from '../../App.slice'

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
          <Toolbar
            actions={actions}
            tableAsyncActions={tableAsyncActions}
            onAddButtonClick={() => history.push(endpoints.users.create)}
            canSearch={user.can("root/user_list")}
            canCreate={user.can("root/user_create")}
          />

          {user.can("root/user_list") && (
            <PaginatedTable
              reducerName="users"
              adapter={adapter}
              actions={actions}
              asyncActions={tableAsyncActions}
              onRowClick={item => history.push(endpoints.users.update.replace(/:uuid/, item.uuid))}
            />
          )}
        </Paper>
      )}
    />
  )
}

export default React.memo(Users)
