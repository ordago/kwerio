import { CssBaseline } from "@material-ui/core"
import { render } from "react-dom"
import React from "react"

import Login from "./Login/index.jsx"

render(
  <div>
    <CssBaseline />
    <Login />
  </div>,
  document.getElementById("root")
)
