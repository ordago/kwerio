import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter, tableAsyncActions } from "./index.slice"
import { endpoints } from "../../routes/app"
import AccountPage from "../../components/AccountPage"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

function Users() {
  const classes = useStyles(),
    state = useSelector(state => state.users),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    loading = useSelector(state => state.users.loading)

  return (
    <AccountPage
      loading={loading}
      title={t("Users")}
      content={() => (
        <Paper>
          <Toolbar
            actions={actions}
            tableAsyncActions={tableAsyncActions}
            onAddButtonClick={() => history.push(endpoints.users.create)}
          />

          <PaginatedTable
            reducerName="users"
            adapter={adapter}
            actions={actions}
            asyncActions={tableAsyncActions}
            onRowClick={item => history.push(endpoints.users.update.replace(/:uuid/, item.uuid))}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(Users)
