import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { adapter, tableAsyncActions, actions } from "./index.slice"
import { endpoints } from "../../routes/app"
import AccountPage from "../../components/AccountPage"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
import useT from "../../hooks/useT"

function Groups() {
  const state = useSelector(state => state.groups),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  return (
    <AccountPage
      loading={state.loading}
      title={t("Groups")}
      content={() => (
        <Paper>
          <Toolbar
            actions={actions}
            tableAsyncActions={tableAsyncActions}
            onAddButtonClick={() => history.push(endpoints.groups.create)}
          />

          <PaginatedTable
            actions={actions}
            adapter={adapter}
            reducerName="groups"
            asyncActions={tableAsyncActions}
            onRowClick={item => history.push(endpoints.groups.update.replace(/:uuid/, item.uuid))}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(Groups)
