import "fontsource-roboto"

import { BrowserRouter, Switch } from "react-router-dom"
import { CssBaseline } from "@material-ui/core"
import { MuiPickersUtilsProvider  } from "@material-ui/pickers"
import { Provider, useSelector, useDispatch } from "react-redux"
import { SnackbarProvider } from "notistack"
import { create } from "jss"
import {
  jssPreset,
  StylesProvider,
  ThemeProvider,
  createTheme,
} from "@material-ui/core/styles"
import DayjsUtils from "@date-io/dayjs"
import React from "react"
import rtl from "jss-rtl"

import { actions, fetch_metadata } from "./App.slice"
import Main from "./components/Main"
import useRoutes from "./hooks/useRoutes"
import useStyles from "./App.styles"

function InnerApp({ moduleRoutes, module }) {
  const { theme, config, user } = useSelector(state => state.app),
    dispatch = useDispatch(),
    classes = useStyles(),
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

      const theme_type = localStorage.getItem("theme.palette.type")

      if (theme_type) {
        dispatch(actions.setThemePaletteType(theme_type))
      }
  }, [])

  return (
    <StylesProvider jss={jss}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <ThemeProvider theme={muiTheme}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={3000}
          >
            <div className={classes.root}>
              <CssBaseline />
              <BrowserRouter>
                <Main>
                  {module()}
                  <Switch>{routes}</Switch>
                </Main>
              </BrowserRouter>
            </div>
          </SnackbarProvider>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
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
