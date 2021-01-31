import { render } from "react-dom"
import React from "react"

import App from "Kwerio/App"
import createStore from "Kwerio/store"

import { components } from "./routes/index.jsx"
import reducer from "./index.slice"

const reducers = {
  module: reducer,
}

function Module() {
  return []
}

render(
  <App
    store={createStore(reducers)}
    moduleRoutes={components}
    module={() => <Module />}
  />,
  document.getElementById("root")
)
