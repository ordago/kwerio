import { Paper, TableCell } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { adapter, tableAsyncActions, actions } from "./index.slice"
import { endpoints } from "../../routes/app"
import AccountMenu from "../../components/Menus/AccountMenu"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
import useT from "../../hooks/useT"

function Groups({ match }) {
  const state = useSelector(state => state.groups),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  return (
    <Page
      loading={state.loading}
      title={t("Groups")}
      menu={() => <AccountMenu match={match} />}
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
            onRowClick={item => {
              if (item.name !== "root") {
                history.push(endpoints.groups.update.replace(/:uuid/, item.uuid))
              }
            }}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(Groups)
