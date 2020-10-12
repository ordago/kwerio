import { render } from "react-dom"
import React from "react"

import App from "Kwerio/App"
import Page from "Kwerio/pages/Page"
import createStore from "Kwerio/store"
import modules from "Kwerio/pages/Modules/index.slice"
import users from "Kwerio/pages/Users/index.slice"
import groups from "Kwerio/pages/Groups/index.slice"

const reducers = {
  groups,
  users,
  modules,
}

render(
  <App store={createStore(reducers)}>
    <Page />
  </App>,
  document.getElementById("root")
)
