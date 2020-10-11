import { createSlice } from "@reduxjs/toolkit"

import PaginatedTable from "Kwerio/components/PaginatedTable"

import { api } from "../../routes/app"

const PREFIX = 'modules'

const paginatedTable = PaginatedTable(api.modules, PREFIX)

const initialState = {
  ...paginatedTable.initialState,
  columns: [

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
  },
})

export const actions = slice.actions
export const asyncActions = paginatedTable.asyncActions("modules", slice)

export default slice.reducer
