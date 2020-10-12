import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

import PaginatedTable from "Kwerio/components/PaginatedTable"

import { api, endpoints } from "../../routes/app"

const PREFIX = 'groups'

const paginatedTable = PaginatedTable(api.groups, PREFIX)

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => (
  (await axios.get(api.groups.metadata)).data
))

const initialState = {
  ...paginatedTable.initialState,
  columns: [
    { slug: "id", label: "Id" },
    { slug: "name", label: "Name", sort: true, sortDirection: "asc" },
    { slug: "modules", label: "Modules", sort: true, sortDirection: "asc" },
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

    // fetch_metadata
    [fetch_metadata.pending]: (state, action) => {
    },
    [fetch_metadata.rejected]: (state, action) => {
      console.error(action)
    },
    [fetch_metadata.pending]: (state, action) => {
      console.log(action)
    },
  },
})

export const actions = slice.actions
export const asyncActions = paginatedTable.asyncActions("groups", slice)

export default slice.reducer
