import { render } from "react-dom"
import React from "react"

import App from "Kwerio/App"
import createStore from "Kwerio/store"

const reducers = {

}

render(
  <App store={createStore(reducers)}>
    hi there
  </App>,
  document.getElementById("root")
)
