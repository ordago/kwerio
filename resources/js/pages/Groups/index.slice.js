import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import { PREFIX, upsert, fetch_by_uuid, extraReducers } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: group => group.uuid,
})

export const form = Form({
  name: {},
  modules: {
    required: false,
    value: [],
  },
})

const paginatedTable = PaginatedTable(PREFIX, api.groups, adapter)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  loading: false,
  upsert: {
    ...form.state,
    uuid: null,
  },
  columns: [
    { slug: "name", label: "Name", sort: true, sortDirection: "asc", sortOrder: 2 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 2 },
  ],
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...form.reducers,
    ...paginatedTable.reducers,
    upsertOne: adapter.upsertOne,
    resetUpsert: (state, action) => {
      state.upsert.uuid = null
      state.upsert.name.value = ""
      state.upsert.modules.value = []
    },
    handleChange: (state, action) => {
      form.reducers.handleChange(state.upsert, action)
    },
    handleBlur: (state, action) => {
      form.reducers.handleBlur(state.upsert, action)
    },
    fillUpsert: (state, action) => {
      const item = action.payload
      state.upsert.uuid = item.uuid
      state.upsert.name.value = item.name
      state.upsert.modules.value = item.modules
    },
  },
  extraReducers: {
    ...paginatedTable.extraReducers,
    ...extraReducers,
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("groups", actions)
export const asyncActions = {
  upsert,
  fetch_by_uuid,
}

export default slice.reducer
