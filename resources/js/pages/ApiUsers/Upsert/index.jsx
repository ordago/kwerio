import { Alert } from "@material-ui/lab"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  Switch,
  TextField
} from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import { actions, adapter } from "../index.slice"
import { actions as appActions } from "../../../App.slice"
import Groupable from "../../../components/Groupable/index.jsx"
import Page from "../../../components/Page"
import services from "../index.service"
import useRequest from "../../../hooks/useRequest"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"

function Upsert({ match }) {
  const state = useSelector(state => state.apiUsers),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch(),
    request = useRequest({ reducer: "apiUsers", services: services({ actions }) }),
    uuid = useUuid({ reducer: "apiUsers", match, adapter, request, actions }),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    history = useHistory()

  React.useEffect(() => { request.metadata() }, [])

  function _get_token() {
    const item = selector.selectById(state, uuid)

    if (item && !_.isNull(item.token_unhashed)) {
      return item.token_unhashed
    } else if (item && item.is_hashed) {
      return "[TOKEN]"
    } else if (item && !item.is_hashed) {
      return item.token
    }
  }

  function _is_hashed_disabled() {
    if (_.isUndefined(uuid)) return false
    const item = selector.selectById(state, uuid)
    if (item && item.is_hashed) return true
    return false
  }

  return (
    <Page
      loading={state.loading}
      menu="app.permissionsMenu"
      menuActions={appActions}
      title={t("Api Users")}
      content={() => (
        <Card>
          <CardContent>

            {/* NAME */}
            <TextField
              label={t("Name")}
              value={state.upsert.name.value}
              onChange={e => dispatch(actions.handleChange({ name: "name", value: e.target.value }))}
              fullWidth
            />

            {/* IS HASHED */}
            <FormControlLabel
              label={t("Is hashed")}
              control={
                <Switch
                  checked={state.upsert.is_hashed.value}
                  disabled={_is_hashed_disabled()}
                  onChange={e => dispatch(actions.handleChange({ name: "is_hashed", value: e.target.checked }))}
                />
              }
            />

            {state.upsert.is_hashed.value && (
              <Alert severity="warning">{t("Hashed tokens can only be copied once.")}</Alert>
            )}

            {/* Expires at */}
            <TextField
              label={t("Expires after")}
              value={state.upsert.expires_at.value}
              onChange={e => dispatch(actions.handleChange({ name: "expires_at", value: e.target.value }))}
              fullWidth
            />

            <Groupable
              state={state}
              actions={actions}
            />

            {!_.isUndefined(uuid) && (
              <pre>
                curl [HOST] -H "Authorization: Bearer {_get_token(state, uuid)}"
              </pre>
            )}
          </CardContent>

          <CardActions>
            <Button
              disabled={state.loading}
              onClick={() => {
                let token_unhashed = null

                if (!_.isUndefined(uuid)) {
                  const item = selector.selectById(state, uuid)
                  if (!_.isUndefined(item)) token_unhashed = item.token_unhashed
                }

                request.upsert(token_unhashed)
              }}
            >
              save
            </Button>
          </CardActions>
        </Card>
      )}
    />
  )
}

export default React.memo(Upsert)
