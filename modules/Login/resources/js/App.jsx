import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CssBaseline,
  Fab,
  FormControlLabel,
  Hidden,
  Link,
  TextField,
  Typography
} from "@material-ui/core"
import { useSnackbar  } from "notistack"
import LockIcon from "@material-ui/icons/Lock"
import React, { useState } from "react"
import clsx from "clsx"

import axios from "axios"

import useStyles from "./App.styles"

function App() {
  const classes = useStyles(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [remember_me, setRememberMe] = useState(false),
    [loading, setLoading] = useState(false),
    [success, setSuccess] = useState(false),
    { enqueueSnackbar } = useSnackbar()

  function submit() {
    setLoading(true)

    axios.post("/_/login", { email, password, remember_me })
      .then(response => {
        if (response.status === 200) {
          enqueueSnackbar("Redirecting..")
          setSuccess(true)
          setLoading(false)
          setTimeout(() => window.location.href = response.data, 500)
        }
      })
      .catch(err => {
        console.error(err)
        enqueueSnackbar("Login failed.", { variant: "error" })
        setLoading(false)
      })
  }

  return (
    <Box className={classes.root} display="flex" flexDirection="row">
      <CssBaseline />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
      >
        <Box display="flex" flexDirection="column" p={2} width="400px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={1}
            mt={5}
            mb={5}
            flexDirection="column"
          >
            <Fab className={classes.fab} size="medium" disableFocusRipple disableRipple color="primary">
              <LockIcon />
            </Fab>
            <Typography variant="h6">Sign in</Typography>
          </Box>

          <TextField
            label="Email address *"
            name="email"
            variant="outlined"
            onChange={e => setEmail(e.target.value)}
            className={classes.email}
          />

          <TextField
            label="Password *"
            name="password"
            type="password"
            variant="outlined"
            onChange={e => setPassword(e.target.value)}
            className={classes.password}
          />

          <FormControlLabel
            label="Remember me"
            className={classes.rememberMe}
            control={<Checkbox color="primary" checked={remember_me} onChange={e => setRememberMe(e.target.checked)} />}
          />

          <Box className={classes.loginBtnWrapper}>
            <Button
              color="primary"
              className={clsx(classes.loginBtn, {
                [classes.loginBtnSuccess]: success,
              })}
              size="large"
              variant="contained"
              disabled={loading}
              onClick={submit}
            >
              Sign In
            </Button>

            {loading && <CircularProgress className={classes.loginBtnProgress} size={24} />}
          </Box>

          <Link href="#" color="primary">
            Forget Password
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default React.memo(App)
