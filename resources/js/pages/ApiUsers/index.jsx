import { Paper, TableCell, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import _ from "lodash"

import { actions, adapter } from "./index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"
import useUser from "../../hooks/useUser"

function ApiUsers({ match }) {
  const classes = useStyles(),
    state = useSelector(state => state.apiUsers),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    loading = state.loading,
    user = useUser()

  function _render_cell(row, col) {
    if (col.slug === "expired_at" && _.isEmpty(row[col.slug])) {
      return (
        <TableCell key={col.slug}>
          <Typography variant="caption">{t("forever")}</Typography>
        </TableCell>
      )
    }

    if (col.slug === "token") {
      if (row.is_hashed) {
        return (
          <TableCell key={col.slug}>
            <Typography variant="caption">{t("hashed")}</Typography>
          </TableCell>
        )
      }
    }

    return (
      <TableCell key={col.slug}>
        {row[col.slug]}
      </TableCell>
    )
  }

  return (
    <Page
      loading={loading}
      title={t("Api Users")}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      content={() => (
        <Paper>
          {user.canAny(["root/api_user_list", "root/api_user_create", "root/api_user_update"]) && (
            <PaginatedTable
              toolbar
              abilitiesPrefix="root/api_user_"
              reducer="apiUsers"
              adapter={adapter}
              api={api.lordland.admission.apiUsers}
              endpoint={endpoints.lordland.admission.apiUsers}
              actions={actions}
              onRowClick={item => history.push(endpoints.lordland.admission.apiUsers.update.replace(/:uuid/, item.uuid))}
              renderCell={_render_cell}
            />
          )}
        </Paper>
      )}
    />
  )
}

export default React.memo(ApiUsers)
