import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import { PREFIX, extraReducers } from "./index.service"
import abilities from "../../components/Abilities/index"
import paginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: group => group.uuid,
})

export const form = Form({
  name: {  },
  ...abilities.form,
  modules: {
    validator: {
      required: false,
    },
    value: [],
  },
})

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
    ...paginatedTable.init_reducers(adapter),
    ...abilities.reducers,
    updateRscTotal: (state, action) => {
      state.rsc.total = action.payload
    },
    resetUpsert: (state, action) => {
      state.upsert.uuid = null
      state.upsert.name.value = ""
      state.upsert.modules.value = []
      state.upsert.abilities.value = []
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
      state.upsert.abilities.value = item.abilities
    },
  },
  extraReducers: {
    ...paginatedTable.init_extraReducers("groups"),
    ...extraReducers,
  },
})

export const actions = slice.actions

export default slice.reducer
