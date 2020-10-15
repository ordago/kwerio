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

import { actions, asyncActions } from "../index.slice"
import { adapter } from "../index.slice"
import { endpoints } from "../../../routes/app"
import {
  adapter as modulesAdapter,
  asyncActions as modulesAsyncACtions
} from "../../Modules/index.slice"
import { notify } from "../../../utils/errors"
import Header from "../Header"
import OneColumnPage from "../../Page/OneColumnPage"
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
    selector = adapter.getSelectors()

  const modules_data = modulesSelector.selectAll(modulesState),
    uuid = _.get(match, "params.uuid")

  React.useEffect(() => {
    dispatch(modulesAsyncACtions.all()).then(action => notify(action, enqueueSnackbar))

    if (!_.isUndefined(uuid)) {
      const item = selector.selectById(state, uuid)

      if (_.isUndefined(item)) {
        dispatch(asyncActions.fetch_by_uuid(uuid)).then(action => notify(action, enqueueSnackbar))
      }
    }
  }, [])

  return (
    <Box>
      <Header RightComponent={<HeaderRight loading={state.loading || modulesState.loading} />} />

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
              value={modules.value}
              filterSelectedOptions
              options={modules_data}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option.uid === value.uid}
              onChange={(e, value, reason) => dispatch(actions.handleChange({ name: modules.name, value }))}
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
                      enqueueSnackbar(`Group ${name.value} created successfully`, { variant: "success" })
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
