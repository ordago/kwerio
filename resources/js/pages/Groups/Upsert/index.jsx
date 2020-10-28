import { Autocomplete } from "@material-ui/lab"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField
} from "@material-ui/core"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes/app"
import {
  adapter as modulesAdapter,
  asyncActions as modulesAsyncActions
} from "../../Modules/index.slice"
import { notify } from "../../../utils/errors"
import OneColumnPage from "../../../components/OneColumnPage"
import useStyles from "./index.styles"

function Upsert({ match }) {
  const state = useSelector(state => state.groups),
    { name, modules } = state.upsert,
    classes = useStyles(),
    modulesSelector = modulesAdapter.getSelectors(),
    modulesState = useSelector(state => state.modules),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    history = useHistory(),
    selector = adapter.getSelectors(),
    modules_data = modulesSelector.selectAll(modulesState)

  let modules_value = []

  if (modules_data.length > 0) {
    modules_value = modules.value
      .map(uid => modulesSelector.selectById(modulesState, uid))
      .filter(Boolean)
  }

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
    dispatch(modulesAsyncActions.all()).then(action => notify(action, enqueueSnackbar))
  }, [])

  return (
    <Box>
      <OneColumnPage className={classes.root}>
        <Card>
          <CardContent>
            <TextField
              name={name.name}
              label="Group name"
              fullWidth
              value={name.value}
              onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
              onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
              helperText={name.error ? name.helper_text : ""}
              error={name.error}
            />

            <Autocomplete
              multiple
              name={modules.name}
              value={modules_value}
              filterSelectedOptions
              options={modules_data}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option.uid === value.uid}
              onChange={(e, value, reason) => {
                dispatch(actions.handleChange({
                  name: modules.name,
                  value: value.map(module => module.uid)
                }))
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Modules"
                  margin="dense"
                />
              )}
            />
          </CardContent>

          <CardActions>
            <Button
              disabled={is_disabled({ name })}
              onClick={() => {
                dispatch(asyncActions.upsert())
                  .then(action => notify(action, enqueueSnackbar))
                  .then(action => {
                    if (!_.isUndefined(action)) {
                      enqueueSnackbar(`Success`, { variant: "success" })
                      history.push(endpoints.groups.index)
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

export default React.memo(Upsert)
