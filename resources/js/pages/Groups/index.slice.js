import { createSlice } from "@reduxjs/toolkit"

import PaginatedTable from "Kwerio/components/PaginatedTable"

import { api } from "../../routes/app"

const PREFIX = 'groups'

const paginatedTable = PaginatedTable(api.groups, PREFIX)

const initialState = {
  ...paginatedTable.initialState,
  columns: [
    { slug: "id", label: "Id" },
    { slug: "email", label: "Email", sort: true, sortDirection: "asc" },
    { slug: "first_name", label: "First name", sort: true, sortDirection: "asc" },
    { slug: "last_name", label: "Last name", sort: true, sortDirection: "asc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirectory: "desc" },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc" },
  ]
}

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
export const asyncActions = paginatedTable.asyncActions("groups", slice)

export default slice.reducer
