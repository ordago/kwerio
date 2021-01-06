import { Paper, TableCell, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import _ from "lodash"

import { actions, adapter, tableAsyncActions } from "./index.slice"
import { endpoints } from "../../routes/app"
import AccountMenu from "../../components/Menus/AccountMenu"
import Page from "../../components/Page"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "../../components/PaginatedTable/Toolbar"
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

  function _renderCell(row, col) {
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
      menu={() => <AccountMenu match={match} />}
      content={() => (
        <Paper>
          <Toolbar
            actions={actions}
            tableAsyncActions={tableAsyncActions}
            onAddButtonClick={() => history.push(endpoints.apiUsers.create)}
            canSearch={user.can("root/api_user_list")}
            canCreate={user.can("root/api_user_create")}
          />

          {user.can("root/api_user_list") && (
            <PaginatedTable
              reducerName="apiUsers"
              adapter={adapter}
              actions={actions}
              asyncActions={tableAsyncActions}
              renderCell={_renderCell}
              onRowClick={row => history.push(endpoints.apiUsers.update.replace(/:uuid/, row.uuid))}
            />
          )}
        </Paper>
      )}
    />
  )
}

export default React.memo(ApiUsers)
