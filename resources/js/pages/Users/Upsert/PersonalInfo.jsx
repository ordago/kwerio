import { Grid, TextField, Typography } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { actions } from "../index.slice"
import useT from "../../../hooks/useT"

function PersonalInfo() {
  const state = useSelector(state => state.users),
    t = useT(),
    { email, first_name, last_name, password, password_confirmation } = state.upsert,
    dispatch = useDispatch()

  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        {/* Email */}
        <TextField
          name={email.name}
          type="email"
          label={t("Email")}
          fullWidth
          value={email.value}
          onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
          onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
          helperText={email.error ? email.helper_text : ""}
          error={email.error}
        />
      </Grid>

      <Grid item sm={6}>
        {/* Password */}
        <TextField
          name={password.name}
          type="password"
          label={t("Password")}
          fullWidth
          value={password.value}
          onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
          onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
          helperText={password.error ? password.helper_text : ""}
          error={password.error}
        />

        {/* First name */}
        <TextField
          name={first_name.name}
          label={t("First name")}
          fullWidth
          value={first_name.value}
          onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
          onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
          helperText={first_name.error ? first_name.helper_text : ""}
          error={first_name.error}
        />
      </Grid>

      <Grid item sm={6}>
        {/* Password Confirmation */}
        <TextField
          name={password_confirmation.name}
          type="password"
          label={t("Confirm password")}
          fullWidth
          value={password_confirmation.value}
          onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
          onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
          helperText={password_confirmation.error ? password_confirmation.helper_text : ""}
          error={password_confirmation.error}
        />

        {/* Last name */}
        <TextField
          name={last_name.name}
          label={t("Last name")}
          fullWidth
          value={last_name.value}
          onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
          onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
          helperText={last_name.error ? last_name.helper_text : ""}
          error={last_name.error}
        />
      </Grid>
    </Grid>
  )
}

export default React.memo(PersonalInfo)
