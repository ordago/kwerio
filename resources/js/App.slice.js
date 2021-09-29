import { blue, pink } from "@mui/material/colors"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { useMediaQuery } from "@mui/material"

import _ from "lodash"
import axios from "axios"

import { api } from "./routes"
import menu from "./slices/metadata/menu"

const PREFIX = 'app'

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => (
  (await axios.get(api.metadata)).data
))

const initialState = {
  user: {
    uuid: null,
    owner_at: null,
    is_owner: false,
    email: "",
    first_name: "",
    last_name: "",
    locale: "en",
    timezone: "UTC",
    locale_iso_format: "L",
    is_rtl: false,
    dir: "ltr",
    groups: [],
    abilities: [],
  },
  theme: {
    palette: {
      primary: blue,
      secondary: pink,
      type: "light",
    },
    direction: "ltr",
    props: {
      MuiTable: {
        size: "small",
      },
      MuiListItem: {
        dense: true,
      },
      MuiList: {
        dense: true,
      },
      MuiChip: {
        size: "small",
      },
      MuiCheckbox: {
        color: "primary",
        size: "small",
      },
      MuiTextField: {
        margin: "dense",
        size: "small",
        autoComplete: "new-password",
      },
      MuiFormControl: {
        margin: "dense",
        size: "small",
        variant: "outlined",
        fullWidth: true,
      },
      MuiFab: {
        size: "small",
      },
      MuiButton: {
        size: "small",
        variant: "contained",
        color: "primary",
      },
      MuiIconButton: {
        size: "small",
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
  },
  config: {
    main_menu_width: 292,
    menu_width: 254,
    appbar_height: 48,
    page_header_height: 40,
  },
  menu: {
    open: false,
    data: [],
  },
  t: {},
}

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...menu.reducers,
    setThemePaletteType: (state, action) => {
      state.theme.palette.type = action.payload
    },
    toggleBrightness: (state, action) => {
      if (state.theme.palette.type === "dark") {
        state.theme.palette.type = "light"
        localStorage.setItem("theme.palette.type", "light")
      } else {
        state.theme.palette.type = "dark"
        localStorage.setItem("theme.palette.type", "dark")
      }
    },
    toggleMainMenu: (state, action) => { state.menu.open = !state.menu.open },
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
    expandMenu: (state, action) => {
      for (let i = 0; i < state.menu.data.length; i ++) {
        for (let j = 0; j < state.menu.data[i].children.length; j ++) {
          let item = state.menu.data[i].children[j]
          if (item.id === action.payload) {
            item.open = !item.open
            return
          }

          if (_.hasIn(item, "children")) {
            for (let k = 0; k < item.children.length; k ++) {
              let sub_item = item.children[k]
              if (sub_item.id === action.payload) {
                sub_item.open = !sub_item.open
                return
              }
            }
          }
        }
      }
    }
  },
  extraReducers: {
    // fetch_metadata
    [fetch_metadata.pending]: (state, action) => {
    },
    [fetch_metadata.rejected]: (state, action) => {
      console.error(action)
    },
    [fetch_metadata.fulfilled]: (state, action) => {
      state.t = action.payload.translations
      state.menu = action.payload.menu
      state.user = action.payload.user
      state.theme.direction = action.payload.user.dir
    },
  },
})

export const actions = slice.actions

export default slice.reducer
