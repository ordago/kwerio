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
import { useSnackbar } from "notistack"
import React from "react"

import { actions } from "../index.slice"
import {
  adapter as modulesAdapter,
  asyncActions as modulesAsyncACtions
} from "../../Modules/index.slice"
import { notify } from "../../../utils/errors"
import Header from "../Header"
import OneColumnPage from "../../Page/OneColumnPage"
import useStyles from "./index.styles"

function Upsert() {
  const state = useSelector(state => state.groups),
    { name, modules } = state.upsert,
    classes = useStyles(),
    modulesSelector = modulesAdapter.getSelectors(),
    modulesState = useSelector(state => state.modules),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar()

  const modules_data = modulesSelector.selectAll(modulesState)

  console.log(modules.value)

  React.useEffect(() => {
    dispatch(modulesAsyncACtions.all()).then(action => notify(action, enqueueSnackbar))
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
              onClick={() => dispatch(update_or_create())}
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
