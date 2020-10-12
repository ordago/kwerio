import { Button, Link, Paper, TextField } from "@material-ui/core"
import React, { useState } from "react"

import _ from "lodash"
import axios from "axios"

import useStyles from "./index.styles"

const RE_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function Signup() {
  const [email, setEmail] = useState("")
  const [email_error, setEmailError] = useState("")
  const [password, setPassword] = useState("")
  const [password_error, setPasswordError] = useState("")
  const [password_confirmation, setConfirmedPassword] = useState("")
  const [password_confirmation_error, setConfirmedPasswordError] = useState("")

  const classes = useStyles()

  function handleChange(e) {
    const { name, value } = e.target

    if (name === "email") {
      setEmail(value)
      setEmailError("")
    } else if (name === "password") {
      setPassword(value)
      setPasswordError("")
    } else if (name === "password_confirmation") {
      setConfirmedPassword(value)
      setConfirmedPasswordError("")
    }
  }

  function submit() {
    const pwd = _.trim(password),
      conf_pwd = _.trim(password_confirmation)

    let has_errors = false

    if (!RE_EMAIL.test(email)) {
      setEmailError("Email is not valid")
      has_errors = true
    }

    if (pwd.length < 6) {
      setPasswordError("Password length should be >= 6")
      has_errors = true
    }

    if (pwd !== conf_pwd) {
      setConfirmedPasswordError("Password do not match")
      has_errors = true
    }

    if (has_errors) {
      return
    }

    axios.post(`/_/basic-authentication/signup`, { email, password, password_confirmation })
      .then(response => {
        if (response.status === 201) {
          window.location.href = "/"
        }
      })
      .catch(e => console.error(e))
  }

  return (
    <Paper className={classes.root}>
      <TextField
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={handleChange}
        helperText={email_error}
        error={email_error.length > 0}
        margin="dense"
        size="small"
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={handleChange}
        helperText={password_error}
        error={password_error.length > 0}
        margin="dense"
        size="small"
      />

      <TextField
        name="password_confirmation"
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={password_confirmation}
        onChange={handleChange}
        helperText={password_confirmation_error}
        error={password_confirmation_error.length > 0}
        margin="dense"
        size="small"
      />

      <Button
        onClick={submit}
        name="signup_btn"
        color="primary"
        variant="contained"
      >
        Signup
      </Button>

      <Link href="/_/basic-authentication/login">Login</Link>
    </Paper>
  )
}

export default Signup
