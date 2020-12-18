import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"

import { PREFIX } from "./index.service"
import { api } from "../../routes/app"
import PaginatedTable from "../../components/PaginatedTable"

export const adapter = createEntityAdapter({
  selectId: accessToken => accessToken.uuid,
})

const initialState = adapter.getInitialState({
  loading: false,
  upsert: {

  },
  columns: [

  ],
})

const paginatedTable = PaginatedTable(PREFIX, api.accessTokens, adapter)

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {

  },
  extraReducers: {

  },
})

export const actions = slice.actions
export const tableAsyncActions = paginatedTable.asyncActions("accessTokens", actions)
export const asyncActions = {

}

export default slice.reducer
