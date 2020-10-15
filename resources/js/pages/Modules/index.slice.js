import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import * as services from './index.service.js'
import { api } from "../../routes/app"

export const adapter = createEntityAdapter({
  selectId: module => module.uid,
})

const PREFIX = 'modules'

const initialState = adapter.getInitialState({
  loading: false,
  rsc: {
    total: 0,
  },
  columns: [

  ],
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    upsertMany: adapter.upsertMany,
  },
  extraReducers: {
    ...services.reducers,
  },
})

export const actions = slice.actions
export const asyncActions = services

export default slice.reducer
