import "fontsource-roboto"

import { BrowserRouter } from "react-router-dom"
import { CssBaseline } from "@material-ui/core"
import { Provider, useSelector, useDispatch } from "react-redux"
import { create } from "jss"
import { jssPreset, StylesProvider, createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import rtl from "jss-rtl"

import Main from "./components/Main"
import useStyles from "./App.styles"

function InnerApp({ children }) {
  const { theme, config } = useSelector(state => state),
    dispatch = useDispatch(),
    classes = useStyles(),
    muiTheme = React.useMemo(() => createMuiTheme(theme), [theme]),
    jss = create({ plugins: [...jssPreset().plugins, rtl()] })

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <BrowserRouter>
            <Main>{children}</Main>
          </BrowserRouter>
        </div>
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
