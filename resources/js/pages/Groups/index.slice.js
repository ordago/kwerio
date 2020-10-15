import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from '@euvoor/form'

import { PREFIX, upsert, extraReducers } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: group => group.uuid,
})

const form = Form({
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
    { slug: "name", label: "Name", sort: true, sortDirection: "asc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc" },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc" },
  ],
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...form.reducers,
    ...paginatedTable.reducers,
    handleChange: (state, action) => { form.reducers.handleChange(state.upsert, action) },
    handleBlur: (state, action) => { form.reducers.handleBlur(state.upsert, action) },
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
}

export default slice.reducer
