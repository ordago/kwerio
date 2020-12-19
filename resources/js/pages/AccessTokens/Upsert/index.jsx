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

import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes/app"
import { notify } from "../../../utils/errors"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Page from "../../../components/Page"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"

function Upsert({ match }) {
  const state = useSelector(state => state.accessTokens),
    { enqueueSnackbar } = useSnackbar(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch(),
    uuid = useUuid({ reducer: "accessTokens", match, adapter, asyncActions, actions }),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    history = useHistory()

  function _get_token() {
    const item = selector.selectById(state, uuid)

    if (item && item.is_hashed) {
      return "<YOUR TOKEN>"
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
      menu={() => <AccountMenu match={match} />}
      title={t("Access Tokens")}
      content={() => (
        <Card>
          <CardContent>

            {/* NAME */}
            <TextField
              label={t("Name")}
              value={state.upsert.name}
              onChange={e => dispatch(actions.handleChange({ name: "name", value: e.target.value }))}
              fullWidth
            />

            {/* IS HASHED */}
            <FormControlLabel
              label={t("Is hashed")}
              control={
                <Switch
                  checked={state.upsert.is_hashed}
                  disabled={_is_hashed_disabled()}
                  onChange={e => dispatch(actions.handleChange({ name: "is_hashed", value: e.target.checked }))}
                />
              }
            />

            {state.upsert.is_hashed && (
              <Alert severity="warning">{t("Hashed tokens can only be copied once.")}</Alert>
            )}

            {/* Expired at */}
            <TextField
              label={t("Expired after")}
              value={state.upsert.expired_at}
              onChange={e => dispatch(actions.handleChange({ name: "expired_at", value: e.target.value }))}
              fullWidth
            />

            {!_.isUndefined(uuid) && (
              <pre>
                curl host -H "Authorization: Bearer {_get_token(state, uuid)}"
              </pre>
            )}
          </CardContent>

          <CardActions>
            <Button
              disabled={state.loading}
              onClick={() => {
                dispatch(asyncActions.upsert())
                  .then(action => notify(action, enqueueSnackbar))
                  .then(action => {
                    if (!_.isUndefined(action)) {
                      enqueueSnackbar("Success", { variant: "success" })
                    }
                  })
                  .then(action => {
                    if (_.isUndefined(uuid)) {
                      const item = action.payload.items[0]
                      history.push(endpoints.accessTokens.update.replace(/:uuid/, item.uuid))
                    }
                  })
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
