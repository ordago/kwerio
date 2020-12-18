import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { PREFIX, upsert } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable"

export const adapter = createEntityAdapter({
  selectId: accessToken => accessToken.uuid,
})

const paginatedTable = PaginatedTable(PREFIX, api.accessTokens, adapter)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  loading: false,
  upsert: {
    uuid: null,
    name: "",
    is_hashed: false,
    expired_at: "",
  },
  columns: [
    { slug: "email", label: "Created by", sort: true, sortDirection: "asc", sortOrder: 4 },
    { slug: "expired_at", label: "Expired at", sort: true, sortDirection: "desc", sortOrder: 3 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 2 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
  ],
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...paginatedTable.reducers,
    handleChange: (state, action) => {
      state.upsert = {
        ...state.upsert,
        [action.payload.name]: action.payload.value
      }
    },
    resetUpsert: (state, action) => {
      state.upsert = {
        uuid: null,
        name: "",
        is_hashed: false,
        expired_at: "",
      }
    },
  },
  extraReducers: {
    ...paginatedTable.extraReducers,

    // upsert
    [upsert.pending]: (state, action) => {
      state.loading = true
      state.error = false
    },
    [upsert.rejected]: (state, action) => {
      state.loading = false
      state.error = true
      console.error(action)
    },
    [upsert.fulfilled]: (state, action) => {
      state.loading = false
      state.error = false
      console.log(action)
    }
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("accessTokens", actions)

export const asyncActions = {
  upsert,
}

export default slice.reducer
