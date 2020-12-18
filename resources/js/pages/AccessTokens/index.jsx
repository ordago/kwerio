import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import AccountMenu from "../../components/Menus/AccountMenu"
import Page from "../../components/Page"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

function AccessTokens({ match }) {
  const classes = useStyles(),
    state = useSelector(state => state.accessTokens),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    loading = state.loading

  return (
    <Page
      loading={loading}
      title={t("Access Tokens")}
      menu={() => <AccountMenu match={match} />}
      content={() => (
        <Paper>
        </Paper>
      )}
    />
  )
}

export default React.memo(AccessTokens)
