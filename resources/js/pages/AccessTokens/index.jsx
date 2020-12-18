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

function AccessTokens({ match }) {
  const classes = useStyles(),
    state = useSelector(state => state.accessTokens),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    loading = state.loading

  function _renderCell(row, col) {
    if (col.slug === "expired_at" && _.isEmpty(row[col.slug])) {
      return (
        <TableCell key={col.slug}>
          <Typography variant="caption">{t("forever")}</Typography>
        </TableCell>
      )
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
      title={t("Access Tokens")}
      menu={() => <AccountMenu match={match} />}
      content={() => (
        <Paper>
          <Toolbar
            actions={actions}
            tableAsyncActions={tableAsyncActions}
            onAddButtonClick={() => history.push(endpoints.accessTokens.create)}
          />

          <PaginatedTable
            reducerName="accessTokens"
            adapter={adapter}
            actions={actions}
            asyncActions={tableAsyncActions}
            renderCell={_renderCell}
          />
        </Paper>
      )}
    />
  )
}

export default React.memo(AccessTokens)
