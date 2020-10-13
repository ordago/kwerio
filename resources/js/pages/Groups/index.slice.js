import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'
import Form from '@euvoor/form'
import _ from 'lodash'

import PaginatedTable from "Kwerio/components/PaginatedTable"

import { api, endpoints } from "../../routes/app"

const PREFIX = 'groups'

const paginatedTable = PaginatedTable(api.groups, PREFIX)

const form = Form({
  __path: "update_or_create",
  name: {
    helper_text: "Group name is required",
  },
  modules: {
    required: false,
    value: [],
  },
})

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => (
  (await axios.get(api.groups.metadata)).data
))

export const update_or_create = createAsyncThunk(`${PREFIX}/update_or_create`, async (__, { getState }) => {
  const data = getState().groups.update_or_create

  let endpoint = api.groups.update

  if (_.isNull(data.uuid)) {
    endpoint = api.groups.create
  }

  const response = await axios.post(endpoint, {
    uuid: data.uuid,
    name: data.name.value,
    modules: data.modules.value,
  })

  console.log(response)
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
