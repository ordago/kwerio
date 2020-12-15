import { Divider, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import _ from 'lodash'

import { actions } from "../index.slice"

function PersonalInfo() {
  const state = useSelector(state => state.users),
    { type, email, first_name, last_name, password, password_confirmation } = state.upsert,
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

      {type.value === "Web" && (
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

          <Divider />

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
      )}
    </>
  )
}

export default React.memo(PersonalInfo)
