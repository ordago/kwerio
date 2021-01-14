import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form, { types } from "@euvoor/form"

import generate_extra_reducers from "../../utils/generate-extra-reducers"
import groupable from "../../components/Groupable/index"
import paginatedTable from "../../components/PaginatedTable/index"
import services from "./index.service"

export const adapter = createEntityAdapter({
  selectId: user => user.uuid,
})

export const form = Form({
  ...groupable.form,

  /* REQUIRED */
  email: {
    validator: {
      type: types.email,
    },
  },
  password: {},
  password_confirmation: {},

  /* OPTIONAL */
  first_name: {
    validator: {
      required: false,
    },
  },
  last_name: {
    validator: {
      required: false,
    },
  },
  locale: {
    validator: {
      required: false,
    },
  },
  timezone: {
    validator: {
      required: false,
    },
  },
  locale_iso_format: {
    validator: {
      required: false,
    }
  },
})

const extraReducers = generate_extra_reducers("users", services, {
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
      state.languages = action.payload.languages
      state.timezones = action.payload.timezones
      state.localeIsoFormats = action.payload.localeIsoFormats
    }
  }
})

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  upsert: {
    ...form.state,
    uuid: null,
  },
  columns: [
    { slug: "email", label: "Email", sort: true, sortDirection: "asc", sortOrder: 2 },
    { slug: "first_name", label: "First name", sort: true, sortDirection: "asc", sortOrder: 3 },
    { slug: "last_name", label: "Last name", sort: true, sortDirection: "asc", sortOrder: 4 },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirection: "desc", sortOrder: 1 },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc", sortOrder: 5 },
  ],
  languages: [],
  timezones: [],
  localeIsoFormats: [],
})

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    ...paginatedTable.init_reducers(adapter),
    ...form.reducers,
    ...groupable.reducers,
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
      state.upsert.email.value = item.email
      state.upsert.first_name.value = item.first_name
      state.upsert.last_name.value = item.last_name
      state.upsert.locale.value = item.locale
      state.upsert.timezone.value = item.timezone
      state.upsert.locale_iso_format.value = item.locale_iso_format
      state.upsert.groups.value = item.groups
      state.upsert.abilities.value = item.abilities
    },
  },
  extraReducers: {
    ...extraReducers,
    ...paginatedTable.init_extraReducers("users"),
  },
})

export const actions = slice.actions

export default slice.reducer
