import { createAsyncThunk } from "@reduxjs/toolkit"

import _ from "lodash"
import axios from "axios"

import { actions, adapter } from "./index.slice"
import { api } from "../../routes/app"
import { needs_more } from "../../utils/service"
import { rsc_catched_error } from "../../utils/errors"

export const PREFIX = "MODULES"

/**
 * Fetch all available modules.
 */
export const all = createAsyncThunk(`${PREFIX}/fetch_all`, async (__, { dispatch, getState, rejectWithValue }) => {
  const state = getState().modules

  if (needs_more(state, adapter)) {
    try {
      const response = await axios.post(api.modules.all)

      if (
        response.status === 200
        && _.hasIn(response.data, "items")
        && _.hasIn(response.data, "total")
      ) {
        dispatch(actions.upsertMany(response.data.items))
        return response.data
      }

      return rejectWithValue(response.data)
    }

    catch (err) {
      return rsc_catched_error(err, rejectWithValue)
    }
  }
})

export const reducers = {
  // all
  [all.pending]: (state, action) => {
    state.loading = true
  },
  [all.rejected]: (state, action) => {
    state.loading = false
    console.error(action)
  },
  [all.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }
  }
}
