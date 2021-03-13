import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import abilities from "../../components/Abilities/index"
import generate_extra_reducers from "../../utils/generate-extra-reducers"
import PaginatedTable from "../../components/PaginatedTable/index.slice"
import services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: group => group.uuid,
})

export const form = Form({
  name: { },
  ...abilities.form,
  modules: {
    validator: {
      required: false,
    },
    value: [],
  },
})

const extraReducers = generate_extra_reducers("groups", services, {
  upsert: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    },
  },
  fetch_by_uuid: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    },
  },
})

const initialState = adapter.getInitialState({
  ...PaginatedTable.state,
  upsert: {
    ...form.state,
    uuid: null,
  },
  columns: [
    { slug: "name", label: "Name", sort: true, sortDirection: "asc", sortOrder: 3 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 2 },
  ],
})

const slice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    ...form.reducers,
    ...PaginatedTable.reducers(adapter),
    ...abilities.reducers,
    updateRscTotal: (state, action) => {
      state.rsc.total = action.payload
    },
    resetUpsert: (state, action) => {
      state.upsert = {
        uuid: null,
        ...form.state,
      }
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
    ...PaginatedTable.extraReducers("groups"),
    ...extraReducers,
  },
})

export const actions = slice.actions

export default slice.reducer
