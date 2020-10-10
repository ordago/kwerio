import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

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
