import { CssBaseline } from "@material-ui/core"
import { render } from "react-dom"
import React from "react"

import Login from "./Login"

render(
  <div>
    <CssBaseline />
    <Login />
  </div>,
  document.getElementById("root")
)
