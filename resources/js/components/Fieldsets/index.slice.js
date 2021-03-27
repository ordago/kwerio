import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form from "@euvoor/form"

import generate_extra_reducers from "Kwerio/utils/generate-extra-reducers"
import PaginatedTable from "Kwerio/components/PaginatedTable/index.slice"

import services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: fieldset => fieldset.uuid,
})

const form = Form({
  locale: { },
})

const extraReducers = generate_extra_reducers("fieldsets", services, {
  metadata: {
    fulfilled: (state, action) => {
      if ("fieldsets" in action.payload) {
        state.fieldsets = action.payload.fieldsets
      }
    }
  }
})

const initialState = adapter.getInitialState({
  ...PaginatedTable.state,
  upsert: {
    uuid: null,
    ...form.state,
  },
  columns: [
    { slug: "name", label: "Fieldset", sort: true, sortOrder: 3 },
    { slug: "locale", label: "Locale", sort: true, sortOrder: 4 },
    { slug: "created_at", label: "Created at", sort: true, sortOrder: 2, sortDirection: "desc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortOrder: 1, sortDirection: "desc" },
  ],
  fieldsets: [],
})

const slice = createSlice({
  name: "fieldsets",
  initialState,
  reducers: {
    ...PaginatedTable.reducers(adapter),
    ...form.reducers,
    loaded: (state, action) => {
      state.loaded = true
    },
    toggleDefaultAtExcept: (state, action) => {
      for (let entity in state.entities) {
        state.entities[entity].checked = false
        state.entities[entity].default_at = null
      }

      state.entities[action.payload.uuid].default_at = action.payload.default_at
    },
    fillUpsert: (state, action) => {
      const item = action.payload

      state.upsert.uuid = item.uuid
      state.upsert.locale.value = item.locale
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
  },
  extraReducers: {
    ...PaginatedTable.extraReducers("fieldsets"),
    ...extraReducers,
  },
})

export const actions = slice.actions

export default slice.reducer
