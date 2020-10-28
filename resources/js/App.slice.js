import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { blue, pink } from '@material-ui/core/colors'

import _ from "lodash"
import axios from "axios"

import { api } from "./routes/app"

const PREFIX = 'app'

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => (
  (await axios.get(api.metadata)).data
))

export const fetch_translations = createAsyncThunk(`${PREFIX}/fetch_translations`, async (locale) => (
  (await axios.get(`/i18n/kwerio/${locale}.json`)).data
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
  },
  theme: {
    palette: {
      primary: blue,
      secondary: pink,
      type: "light",
    },
    direction: "ltr",
    props: {
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
        variant: "outlined",
        autoComplete: "new-password",
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
    toggleMenu: (state, action) => { state.menu.open = !state.menu.open },
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
      state.menu = action.payload.menu
      state.user = action.payload.user
      state.theme.direction = action.payload.user.dir
    },

    // fetch_translations
    [fetch_translations.pending]: (state, action) => {
    },
    [fetch_translations.rejected]: (state, action) => {
      console.error(action)
    },
    [fetch_translations.fulfilled]: (state, action) => {
      state.t = action.payload
    }
  },
})

export const actions = slice.actions

export default slice.reducer
