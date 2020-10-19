import "fontsource-roboto"

import { BrowserRouter } from "react-router-dom"
import { CssBaseline } from "@material-ui/core"
import { Provider, useSelector, useDispatch } from "react-redux"
import { SnackbarProvider } from "notistack"
import { create } from "jss"
import { jssPreset, StylesProvider, createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import rtl from "jss-rtl"

import { fetch_metadata, fetch_translations } from "./App.slice"
import Main from "./components/Main"
import useStyles from "./App.styles"

function InnerApp({ children }) {
  const { theme, config, user } = useSelector(state => state.app),
    dispatch = useDispatch(),
    classes = useStyles(),
    muiTheme = React.useMemo(() => createMuiTheme(theme), [theme]),
    jss = create({ plugins: [...jssPreset().plugins, rtl()] })

  React.useEffect(() => {
    dispatch(fetch_metadata())
      .then(action => {
        const { user } = action.payload

        if (user.is_rtl) {
          document.body.setAttribute("dir", user.dir)
        }

        dispatch(fetch_translations(user.locale))
      })
  }, [])

  return (
    <StylesProvider jss={jss}>
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
              <Main>{children}</Main>
            </BrowserRouter>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

function App({ store, children }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <InnerApp>{children}</InnerApp>
      </Provider>
    </React.StrictMode>
  )
}

export default React.memo(App)
