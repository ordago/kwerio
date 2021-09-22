import { Paper } from "@mui/material"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter } from "./index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

function Users({ match }) {
  const classes = useStyles(),
    state = useSelector(state => state.users),
    history = useHistory(),
    t = useT()

  return (
    <Page
      loading={state.loading}
      title={t("Users")}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      content={() => (
        <Paper>
          <PaginatedTable
            abilitiesPrefix="root/user_"
            toolbar
            reducer="users"
            adapter={adapter}
            api={api.lordland.admission.users}
            endpoint={endpoints.lordland.admission.users}
            actions={actions}
            onRowClick={item => history.push(endpoints.lordland.admission.users.update.replace(/:uuid/, item.uuid))}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(Users)
