import { SnackbarProvider  } from "notistack"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { render } from "react-dom"
import React from "react"
import { blue, pink } from '@material-ui/core/colors'

import App from "./App"

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  }
})

console.log(theme)

render(
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3} anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}>
      <App />
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById("root")
)
