import { createSlice } from "@reduxjs/toolkit"
import { blue, pink } from "@material-ui/core/colors"

import _ from "lodash"

const initialState = {
  palette: {
    primary: blue,
    secondary: pink,
    type: "light",
  },
  direction: "ltr",
  props: {
    MuiTextField: {
      margin: "dense",
      size: "small",
      variant: "outlined",
    },
    MuiButton: {
      size: "small",
      variant: "contained",
      color: "primary",
    },
    MuiSwitch: {
      color: "primary",
    },
  },
  overrides: {
    MuiDivider: {
      root: {
        marginTop: 16,
        marginBottom: 16,
      },
    },
  },
}

const theme = createSlice({
  name: "theme",
  initialState,
  reducers: {
    togglePaletteType: (state) => {
      if (_.isUndefined(state.palette)) return

      if (state.palette.type === "dark") { state.palette.type = "light" }
      else state.palette.type = "dark"
    },
    setDirectionToRtl: (state) => {
      state.direction = "rtl"
      document.body.dir = "rtl"
    },
    setDirectionToLtr: (state) => {
      state.direction = "ltr"
      document.body.dir = "ltr"
    },
  }
})

export const {
  togglePaletteType,
  setDirectionToLtr,
  setDirectionToRtl,
} = theme.actions

export default theme.reducer
