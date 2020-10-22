import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
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
import Groups from "./Groups"
import Header from "../Header"
import I18n from "./I18n"
import OneColumnPage from "../../../components/OneColumnPage"
import PersonalInfo from "./PersonalInfo"

function Upsert({ match }) {
  const state = useSelector(state => state.users),
    selector = adapter.getSelectors(),
    { enqueueSnackbar } = useSnackbar(),
    dispatch = useDispatch(),
    { email, first_name, last_name, locale } = state.upsert,
    history = useHistory()

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
    <Box>
      <Header RightComponent={<HeaderRight loading={state.loading} />} />

      <OneColumnPage>
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
      </OneColumnPage>
    </Box>
  )
}

function HeaderRight({ loading }) {
  return (
    <Box>
      {loading && (
        <CircularProgress size={20} />
      )}
    </Box>
  )
}

export default React.memo(Upsert)
