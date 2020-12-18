import { Button, Card, CardActions, CardContent } from "@material-ui/core"
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
