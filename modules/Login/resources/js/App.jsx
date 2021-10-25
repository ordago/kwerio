import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CssBaseline,
  Fab,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useSnackbar  } from "notistack"
import LockIcon from "@mui/icons-material/Lock"
import React, { useState } from "react"

import axios from "axios"

import { textFieldStyles } from "./App.styles.js"

function App() {
  const [email, setEmail] = useState(""),
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
    <>
      <CssBaseline />

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            mt: 3,
          }}
        >
          <Paper>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              p={2}
            >
              <Grid item>
                <Fab size="medium" disableFocusRipple disableRipple color="primary">
                  <LockIcon />
                </Fab>
              </Grid>

              <Grid item mb={5}>
                <Typography variant="h6">Sign in</Typography>
              </Grid>

              <Grid item mb={2}>
                <TextField
                  sx={{ ...textFieldStyles }}
                  label="Email address *"
                  name="email"
                  variant="outlined"
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>

              <Grid item>
                <TextField
                  sx={{ ...textFieldStyles }}
                  label="Password *"
                  name="password"
                  type="password"
                  variant="outlined"
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>

              <Grid item width="100%">
                <FormControlLabel
                  label="Remember me"
                  control={<Checkbox color="primary" checked={remember_me} onChange={e => setRememberMe(e.target.checked)} />}
                />
              </Grid>

              <Grid item width="100%">
                <Button
                  color="primary"
                  size="large"
                  variant="contained"
                  disabled={loading}
                  onClick={submit}
                  sx={{ width: "100%" }}
                >
                  Sign In
                </Button>

                {loading && <CircularProgress size={24} />}
              </Grid>

              <Grid item width="100%">
                <Link href="#" color="primary">
                  Forget Password
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </>
  )
}

export default React.memo(App)
