import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { PREFIX } from "./index.service"
import * as services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: module => module.uuid,
})

const initialState = adapter.getInitialState({
  loading: false,
  rsc: {
    total: 0,
  },
  columns: [

  ],
})

const slice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    upsertMany: adapter.upsertMany,
    updateRscTotal: (state, action) => {
      state.rsc.total = action.payload
    }
  },
  extraReducers: {
    ...services.reducers,
  },
})

export const actions = slice.actions
export const asyncActions = services

export default slice.reducer
