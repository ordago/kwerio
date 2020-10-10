import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import _ from "lodash"
import axios from "axios"

import { api } from "./routes/app"

const PREFIX = 'app'

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => (
  (await axios.get(api.metadata)).data
))

const initialState = {
  menu: {
    open: false,
    data: [],
  },
}

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    toggleMenu: (state, action) => { state.menu.open = !state.menu.open },
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
    },
  },
})

export const actions = slice.actions

export default slice.reducer
