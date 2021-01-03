import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from '@euvoor/form'

import groupable from '../../components/Groupable/index.js'
import { PREFIX, fetch_by_uuid, upsert, metadata } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable"

export const adapter = createEntityAdapter({
  selectId: apiUsers => apiUsers.uuid,
})

export const form = Form({
  ...groupable.form,
  name: { },
  expired_at: {
    validator: {
      required: false,
    },
  },
  is_hashed: {
    value: false,
    validator: {
      required: false,
    },
  },
})

const paginatedTable = PaginatedTable(PREFIX, api.apiUsers, adapter)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  loading: false,
  upsert: {
    ...form.state,
    uuid: null,
  },
  columns: [
    { slug: "name", label: "Name", sort: false, sortDirection: "asc", sortOrder: 5 },
    { slug: "token", label: "Token" },
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
    ...groupable.reducers,
    ...form.reducers,
    upsertOne: adapter.upsertOne,
    fillUpsert: (state, action) => {
      const item = action.payload

      state.upsert.uuid = item.uuid
      state.upsert.name.value = item.name
      state.upsert.is_hashed.value = item.is_hashed
      state.upsert.expired_at.value = item.expired_at
      state.upsert.groups.value = item.groups
      state.upsert.abilities.value = item.abilities
    },
    handleChange: (state, action) => {
      form.reducers.handleChange(state.upsert, action)
    },
    handleBlur: (state, action) => {
      form.reducers.handleBlur(state.upsert, action)
    },
    resetUpsert: (state, action) => {
      state.upsert = {
        uuid: null,
        ...form.state,
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
    }
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("apiUsers", actions)

export const asyncActions = {
  upsert,
  fetch_by_uuid,
  metadata,
}

export default slice.reducer
