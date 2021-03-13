import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import generate_extra_reducers from "../../utils/generate-extra-reducers"
import groupable from "../../components/Groupable/index"
import PaginatedTable from "../../components/PaginatedTable/index.slice"
import services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: apiUsers => apiUsers.uuid,
})

export const form = Form({
  ...groupable.form,
  name: {  },
  expires_at: {
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

const extraReducers = generate_extra_reducers("apiUsers", services, {
  upsert: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    },
  },
  fetch_by_uuid: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    }
  },
  metadata: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    }
  },
})

const initialState = adapter.getInitialState({
  ...PaginatedTable.state,
  loading: false,
  upsert: {
    ...form.state,
    uuid: null,
  },
  columns: [
    { slug: "name", label: "Name", sort: false, sortDirection: "asc", sortOrder: 5 },
    { slug: "token", label: "Token" },
    { slug: "email", label: "Created by", sort: true, sortDirection: "asc", sortOrder: 4 },
    { slug: "expires_at", label: "Expires at", sort: true, sortDirection: "desc", sortOrder: 3 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 2 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
  ],
})

const slice = createSlice({
  name: "apiUsers",
  initialState,
  reducers: {
    ...PaginatedTable.reducers(adapter),
    ...groupable.reducers,
    ...form.reducers,
    fillUpsert: (state, action) => {
      const item = action.payload

      state.upsert.uuid = item.uuid
      state.upsert.name.value = item.name
      state.upsert.is_hashed.value = item.is_hashed
      state.upsert.expires_at.value = item.expires_at
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
    ...extraReducers,
    ...PaginatedTable.extraReducers("apiUsers"),
  },
})

export const actions = slice.actions

export default slice.reducer
