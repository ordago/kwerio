import { createSlice } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import PaginatedTable from "Kwerio/components/PaginatedTable"
import _ from "lodash"

import { PREFIX, fetch_metadata, update_or_create } from "./index.service"
import { api } from "../../routes/app"

const paginatedTable = PaginatedTable(api.groups, PREFIX)

const form = Form({
  name: {
    helper_text: "Group name is required",
  },
  modules: {
    required: false,
    value: [],
  },
})

const initialState = {
  ...paginatedTable.initialState,
  update_or_create: {
    uuid: null,
    ...form.state,
  },
  columns: [
    { slug: "id", label: "Id" },
    { slug: "name", label: "Name", sort: true, sortDirection: "asc" },
    { slug: "modules", label: "Modules", sort: true, sortDirection: "asc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirectory: "desc" },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc" },
  ],
  modules: [],
}

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    ...paginatedTable.reducers,
    handleChange: (state, action) => { form.reducers.handleChange(state.update_or_create, action) },
    handleBlur: (state, action) => { form.reducers.handleBlur(state.update_or_create, action) },
  },
  extraReducers: {
    ...paginatedTable.extraReducers,

    // update_or_create
    [update_or_create.pending]: (state, action) => {
    },
    [update_or_create.rejected]: (state, action) => {
      console.error(action)
    },
    [update_or_create.fulfilled]: (state, action) => {

    },

    // fetch_metadata
    [fetch_metadata.pending]: (state, action) => {
    },
    [fetch_metadata.rejected]: (state, action) => {
      console.error(action)
    },
    [fetch_metadata.fulfilled]: (state, action) => {
      if (_.hasIn(action.payload, "modules")) {
        state.modules = action.payload.modules
      }
    },
  },
})

export const actions = slice.actions
export const asyncActions = paginatedTable.asyncActions("groups", slice)

export default slice.reducer
