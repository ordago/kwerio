import { Paper } from "@mui/material"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter } from "./index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useT from "../../hooks/useT"

function Groups({ match }) {
  const state = useSelector(state => state.groups),
    history = useHistory(),
    t = useT()

  return (
    <Page
      loading={state.loading}
      title={t("Groups")}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      content={() => (
        <Paper>
          <PaginatedTable
            abilitiesPrefix="root/group_"
            toolbar
            reducer="groups"
            adapter={adapter}
            api={api.lordland.admission.groups}
            endpoint={endpoints.lordland.admission.groups}
            actions={actions}
            onRowClick={item => history.push(endpoints.lordland.admission.groups.update.replace(/:uuid/, item.uuid))}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(Groups)
