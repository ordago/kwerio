import "fontsource-roboto"

import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CssBaseline } from "@material-ui/core"
import { Provider, useSelector, useDispatch } from "react-redux"
import { SnackbarProvider } from "notistack"
import { create } from "jss"
import { jssPreset, StylesProvider, createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import rtl from "jss-rtl"

import { endpoints } from "./routes/app"
import { fetch_metadata, fetch_translations } from "./App.slice"
import Main from "./components/Main"
import Suspense from "./components/Suspense"
import useStyles from "./App.styles"

const Groups = React.lazy(() => import("./pages/Groups")),
  GroupsUpsert = React.lazy(() => import("./pages/Groups/Upsert")),
  Users = React.lazy(() => import("./pages/Users")),
  UsersUpsert = React.lazy(() => import("./pages/Users/Upsert")),
  AccessTokens = React.lazy(() => import("./pages/AccessTokens")),
  AccessTokensUpsert = React.lazy(() => import("./pages/AccessTokens/Upsert")),
  Account = React.lazy(() => import("./pages/Account")),
  Profile = React.lazy(() => import("./pages/Profile"))

function InnerApp({ switchRoutes = () => {} }) {
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
              <Main>
                <Switch>

                  {/* ACCOUNT / PERMISSIONS / GROUPS */}
                  <Route exact path={endpoints.groups.create} render={props => <Suspense component={<GroupsUpsert {...props} />} />} />
                  <Route exact path={endpoints.groups.index} render={props => <Suspense component={<Groups {...props} />} />} />
                  <Route exact path={endpoints.groups.update} render={props => <Suspense component={<GroupsUpsert {...props} />} />} />

                  {/* ACCOUNT / PERMISSIONS / USERS */}
                  <Route exact path={endpoints.users.create} render={props => <Suspense component={<UsersUpsert {...props} />} />} />
                  <Route exact path={endpoints.users.update} render={props => <Suspense component={<UsersUpsert {...props} />} />} />
                  <Route exact path={endpoints.users.index} render={props => <Suspense component={<Users {...props} />} />} />

                  {/* ACCOUNT / PERMISSIONS / ACCESS TOKENS */}
                  <Route exact path={endpoints.accessTokens.index} render={props => <Suspense component={<AccessTokens {...props} />} />} />
                  <Route exact path={endpoints.accessTokens.create} render={props => <Suspense component={<AccessTokensUpsert {...props} />} />} />
                  <Route exact path={endpoints.accessTokens.update} render={props => <Suspense component={<AccessTokensUpsert {...props} />} />} />

                  {/* ACCOUNT / SETTINGS */}
                  <Route exact path={endpoints.account.index} render={props => <Suspense component={<Account {...props} />} />} />

                  {/* OTHERS */}
                  <Route exact path={endpoints.profile.index} render={props => <Suspense component={<Profile {...props} />} />} />

                  {switchRoutes()}

                </Switch>
              </Main>
            </BrowserRouter>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

function App({ store, switchRoutes = () => {} }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <InnerApp switchRoutes={switchRoutes} />
      </Provider>
    </React.StrictMode>
  )
}

export default React.memo(App)
