import { TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { actions } from "../index.slice"

function PersonalInfo() {
  const state = useSelector(state => state.users),
    { email, first_name, last_name } = state.upsert,
    dispatch = useDispatch()

  return (
    <>
      {/* Email */}
      <TextField
        name={email.name}
        type="email"
        label="Email"
        fullWidth
        value={email.value}
        onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
        onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
        helperText={email.error ? email.helper_text : ""}
        error={email.error}
      />

      {/* First name */}
      <TextField
        name={first_name.name}
        label="First name"
        fullWidth
        value={first_name.value}
        onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
        onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
        helperText={first_name.error ? first_name.helper_text : ""}
        error={first_name.error}
      />

      {/* Last name */}
      <TextField
        name={last_name.name}
        label="Last name"
        fullWidth
        value={last_name.value}
        onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
        onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
        helperText={last_name.error ? last_name.helper_text : ""}
        error={last_name.error}
      />
    </>
  )
}

export default React.memo(PersonalInfo)
