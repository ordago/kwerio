import { TextField, Autocomplete } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { adapter } from "../../pages/Groups/index.slice"
import Abilities from "../Abilities/index.jsx"
import useT from "../../hooks/useT"

function Groupable({
  state,        // State of the element using Groupable
  actions,      // actions from slice.
}) {
  const { groups, abilities } = state.upsert,
    groupsState = useSelector(state => state.groups),
    selector = adapter.getSelectors(),
    options = selector.selectAll(groupsState),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch()

  return (
    <>
      {/* Select Groups */}
      <Autocomplete
        multiple
        filterSelectedOptions
        fullWidth
        name={groups.name}
        value={groups.value.map(uuid => selector.selectById(groupsState, uuid)).filter(Boolean)}
        options={options}
        getOptionLabel={option => option.name}
        getOptionSelected={(option, value) => option.uuid === value.uuid}
        onChange={(e, value, reason) => {
          dispatch(actions.handleChange({
            name: groups.name,
            value: value.map(group => group.uuid)
          }))
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={t("groups")}
            helperText={groups.error ? groups.helper_text : ""}
            error={groups.error}
          />
        )}
      />

      <Abilities
        parentAdapter={adapter}
        actions={actions}
        state={state}
        reducerName={"groups"}
        items={groups}
      />
    </>
  )
}

export default React.memo(Groupable)
