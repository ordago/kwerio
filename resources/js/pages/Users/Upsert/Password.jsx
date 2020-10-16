import { TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { actions } from "../index.slice"

function Password() {
  const state = useSelector(state => state.users),
    { password, password_confirmation } = state.upsert,
    dispatch = useDispatch()

  return (
    <>
      {/* Password */}
      <TextField
        name={password.name}
        type="password"
        label="Password"
        fullWidth
        value={password.value}
        onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
        onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
        helperText={password.error ? password.helper_text : ""}
        error={password.error}
      />

      {/* Password Confirmation */}
      <TextField
        name={password_confirmation.name}
        type="password"
        label="Confirm password"
        fullWidth
        value={password_confirmation.value}
        onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
        onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
        helperText={password_confirmation.error ? password_confirmation.helper_text : ""}
        error={password_confirmation.error}
      />
    </>
  )
}

export default React.memo(Password)
