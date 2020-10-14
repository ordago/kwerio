import { createSlice } from "@reduxjs/toolkit"

import { api } from "../../routes/app"

const PREFIX = 'modules'

const initialState = {
  columns: [

  ]
}

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
  },
  extraReducers: {
  },
})

export const actions = slice.actions

export default slice.reducer
