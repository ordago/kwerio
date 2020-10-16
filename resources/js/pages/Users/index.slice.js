import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { PREFIX } from './index.service'
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: user => user.uuid,
})

const paginatedTable = PaginatedTable(PREFIX, api.users, adapter)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  loading: false,
  upsert: {
    uuid: null,
  },
  columns: [
    { slug: "email", label: "Email", sort: true, sortDirection: "asc", sortOrder: 2 },
    { slug: "first_name", label: "First name", sort: true, sortDirection: "asc", sortOrder: 3 },
    { slug: "last_name", label: "Last name", sort: true, sortDirection: "asc", sortOrder: 4 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 5 },
  ]
})

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...paginatedTable.reducers,
  },
  extraReducers: {
    ...paginatedTable.extraReducers,
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("users", actions)

export default slice.reducer
