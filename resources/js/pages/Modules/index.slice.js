import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

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

  },
})

export const actions = slice.actions

export default slice.reducer
