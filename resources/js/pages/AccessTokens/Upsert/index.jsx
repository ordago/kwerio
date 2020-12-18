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
import { useSnackbar } from "notistack"
import React from "react"

import { actions, adapter, asyncActions } from "../index.slice"
import { notify } from "../../../utils/errors"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Page from "../../../components/Page"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"

function Upsert({ match }) {
  const state = useSelector(state => state.accessTokens),
    { enqueueSnackbar } = useSnackbar(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch(),
    uuid = useUuid({ reducer: "accessTokens", match, adapter, asyncActions, actions })

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
          </CardContent>

          <CardActions>
            <Button
              disabled={state.loading}
              onClick={() => {
                dispatch(asyncActions.upsert())
                  .then(action => notify(action, enqueueSnackbar))
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
