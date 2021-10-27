import "fontsource-roboto"

import { Box } from "@mui/system"
import { BrowserRouter, Switch } from "react-router-dom"
import { CssBaseline } from "@mui/material"
import { Provider, useSelector, useDispatch } from "react-redux"
import { SnackbarProvider } from "notistack"
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles"
import { create } from "jss"
import { jssPreset, StylesProvider } from "@mui/styles"
import DateAdapter from "@mui/lab/AdapterDayjs"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import React from "react"
import rtl from "jss-rtl"

import { fetch_metadata } from "./App.slice"
import Main from "./components/Main"
import useRoutes from "./hooks/useRoutes"

function InnerApp({ moduleRoutes, module }) {
  const { theme, config, user } = useSelector(state => state.app),
    dispatch = useDispatch(),
    muiTheme = React.useMemo(() => createTheme(theme), [theme]),
    jss = create({ plugins: [...jssPreset().plugins, rtl()] }),
    routes = useRoutes(moduleRoutes)

  React.useEffect(() => {
    dispatch(fetch_metadata())
      .then(action => {
        const { user } = action.payload

        if (user.is_rtl) {
          document.body.setAttribute("dir", user.dir)
        }
      })
  }, [])

  return (
    <StylesProvider jss={jss}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              autoHideDuration={3000}
            >
              <Box sx={{
                backgroundColor: "#fafafa",
                display: "flex",
              }}>
                <CssBaseline />
                <BrowserRouter>
                  <Main>
                    {module()}
                    <Switch>{routes}</Switch>
                  </Main>
                </BrowserRouter>
              </Box>
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </StylesProvider>
  )
}

function App({ store, moduleRoutes = {}, module = () => {} }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <InnerApp module={module} moduleRoutes={moduleRoutes} />
      </Provider>
    </React.StrictMode>
  )
}

export default React.memo(App)
