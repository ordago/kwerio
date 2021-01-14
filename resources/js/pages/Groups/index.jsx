import { Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { actions as appActions } from "../../App.slice"
import Page from "../../components/Page"
import useT from "../../hooks/useT"
import useUser from "../../hooks/useUser"

function Groups({ match }) {
  const state = useSelector(state => state.groups),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    user = useUser(),
    permissionsMenu = useSelector(state => state.app.permissionsMenu)

  return (
    <Page
      loading={state.loading}
      title={t("Groups")}
      menu="app.permissionsMenu"
      menuActions={appActions}
      content={() => (
        <Paper>
        </Paper>
      )}
    />
  )
}

export default React.memo(Groups)
