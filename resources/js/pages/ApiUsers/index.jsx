import { Paper, TableCell, Typography } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import _ from "lodash"

import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
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
      menu="app.permissionsMenu"
      menuActions={appActions}
      content={() => (
        <Paper>
        </Paper>
      )}
    />
  )
}

export default React.memo(ApiUsers)
