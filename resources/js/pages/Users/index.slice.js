import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import Form, { types } from "@euvoor/form"

import { PREFIX, fetch_by_uuid, upsert, extraReducers, metadata } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable/index"

export const adapter = createEntityAdapter({
  selectId: user => user.uuid,
})

export const form = Form({
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
  groups: {
    value: [],
    validator: {
      required: false,
    },
  },
})

const paginatedTable = PaginatedTable(PREFIX, api.users, adapter)

const initialState = adapter.getInitialState({
  ...paginatedTable.initialState,
  loading: false,
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
  name: PREFIX,
  initialState,
  reducers: {
    ...form.reducers,
    ...paginatedTable.reducers,
    upsertOne: adapter.upsertOne,
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
    },
  },
  extraReducers: {
    ...paginatedTable.extraReducers,
    ...extraReducers,
  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("users", actions)
export const asyncActions = {
  upsert,
  fetch_by_uuid,
  metadata,
}

export default slice.reducer
