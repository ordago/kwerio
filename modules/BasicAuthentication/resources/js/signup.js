import { CssBaseline } from "@material-ui/core"
import { render } from "react-dom"
import React from "react"

import Signup from "./Signup"

render(
  <div>
    <CssBaseline />
    <Signup />
  </div>,
  document.getElementById("root")
)
