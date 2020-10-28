import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider
} from "@material-ui/core"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import _ from "lodash"

import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes/app"
import { notify } from "../../../utils/errors"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Groups from "./Groups"
import I18n from "./I18n"
import Page from "../../../components/Page"
import PersonalInfo from "./PersonalInfo"
import useT from "../../../hooks/useT"

function Upsert({ match }) {
  const state = useSelector(state => state.users),
    selector = adapter.getSelectors(),
    { enqueueSnackbar } = useSnackbar(),
    dispatch = useDispatch(),
    { email, first_name, last_name, locale } = state.upsert,
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  React.useEffect(() => {
    const uuid = _.get(match, "params.uuid"),
      item = selector.selectById(state, uuid)

    if (!_.isUndefined(uuid) && _.isUndefined(item)) {
      dispatch(asyncActions.fetch_by_uuid(uuid)).then(action => notify(action, enqueueSnackbar))
    } else if (!_.isUndefined(item)) {
      dispatch(actions.fillUpsert(item))
    } else {
      dispatch(actions.resetUpsert())
    }
  }, [])

  React.useEffect(() => {
    dispatch(asyncActions.metadata()).then(action => notify(action, enqueueSnackbar))
  }, [])

  return (
    <Page
      loading={state.loading}
      menu={() => <AccountMenu match={match} />}
      title={t("Users")}
      content={() => (
        <Card>
          <CardContent>
            <PersonalInfo />
            <Divider />

            <I18n />
            <Divider />

            <Groups />
          </CardContent>

          <CardActions>
            <Button
              disabled={is_disabled({ email })}
              onClick={() => {
                dispatch(asyncActions.upsert())
                  .then(action => notify(action, enqueueSnackbar))
                  .then(action => {
                    if (!_.isUndefined(action)) {
                      enqueueSnackbar(`Success`, { variant: "success" })
                      history.push(endpoints.users.index)
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
