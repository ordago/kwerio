import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions, adapter } from "./index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useT from "../../hooks/useT"
import useUser from "../../hooks/useUser"

function Groups({ match }) {
  const state = useSelector(state => state.groups),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    user = useUser()

  return (
    <Page
      loading={state.loading}
      title={t("Groups")}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      content={() => (
        <Paper>
          {user.canAny(["root/group_list", "root/group_create", "root/group_update"]) && (
            <PaginatedTable
              toolbar
              abilities={{
                index: user.can("root/group_list")
              }}
              reducer="groups"
              adapter={adapter}
              api={api.groups}
              endpoint={endpoints.groups}
              actions={actions}
              onRowClick={item => history.push(endpoints.groups.update.replace(/:uuid/, item.uuid))}
            />
          )}
        </Paper>
      )}
    />
  )
}

export default React.memo(Groups)
