import { Autocomplete } from "@material-ui/lab"
import { TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useSnackbar } from "notistack"
import React from "react"

import { actions } from "../index.slice"
import { adapter as groupsAdapter, asyncActions as groupsAsyncActions } from "../../Groups/index.slice"
import { asyncActions as modulesAsyncActions } from "../../Modules/index.slice"
import { notify } from "../../../utils/errors"

function Groups() {
  const state = useSelector(state => state.users),
    { groups } = state.upsert,
    { enqueueSnackbar } = useSnackbar(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(groupsAsyncActions.all()).then(action => notify(action, enqueueSnackbar))
    dispatch(modulesAsyncActions.all()).then(action => notify(action, enqueueSnackbar))
  }, [])


  /* GROUPS */
  const groupsState = useSelector(state => state.groups),
    groupsSelector = groupsAdapter.getSelectors(),
    groups_data = groupsSelector.selectAll(groupsState)

  let groups_value = []
  if (groups_data.length > 0) {
    groups_value = groups.value
      .map(uuid => groupsSelector.selectById(groupsState, uuid))
      .filter(Boolean)
  }

  return (
    <>
      <Autocomplete
        multiple
        name={groups.name}
        value={groups_value}
        filterSelectedOptions
        options={groups_data}
        getOptionLabel={option => option.name}
        getOptionSelected={(option, value) => option.uuid === value.uuid}
        onChange={(e, value, reason) => {
          dispatch(actions.handleChange({
            name: groups.name,
            value: value.map(group => group.uuid)
          }))
        }}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label="groups"
            helperText={groups.error ? groups.helper_text : ""}
            error={groups.error}
          />
        )}
      />
    </>
  )
}

export default React.memo(Groups)
