import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { actions, form, adapter } from "./index.slice"
import { api } from "../../routes/app"
import { move_to_start, needs_more } from "../../utils/service"
import { rsc_catched_error ,show_under_form_fields } from "../../utils/errors"

export const PREFIX = "GROUPS"

/**
 * Fetch all groups.
 */
export const all = createAsyncThunk(`${PREFIX}/all`, async (__, { dispatch, getState, rejectWithValue }) => {
  const state = getState().groups

  if (needs_more(state, adapter)) {
    try {
      const response = await axios.post(api.groups.all)

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

/**
 * Fetch group by the given uuid.
 */
export const fetch_by_uuid = createAsyncThunk(`${PREFIX}/fetch_by_uuid`, async (uuid, { getState, dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(api.groups.fetch_by_uuid, { uuid })

    if (response.status === 200 && _.hasIn(response.data, "total") && _.hasIn(response.data, "items")) {
      if (response.data.items.length === 1) {
        dispatch(actions.upsertOne({ ...response.data.items[0] }))
        dispatch(actions.fillUpsert(response.data.items[0]))
        return response.data
      }
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

/**
 * Insert or Update the given item.
 */
export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const { uuid, name, modules } = getState().groups.upsert
    let endpoint = api.groups.update

    if (_.isNull(uuid)) {
      endpoint = api.groups.create
    }

    const response = await axios.post(endpoint, {
      uuid,
      name: name.value,
      modules: modules.value,
    })

    if (response.status === 200 && _.hasIn(response.data, "total") && _.hasIn(response.data, "items")) {
      if (response.data.items.length === 1) {
        dispatch(actions.upsertOne({
          ...response.data.items[0],
          touched_at: Date.now(),
        }))

        dispatch(actions.softReset())

        return response.data
      }
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

export const extraReducers = {

  // upsert
  [upsert.pending]: (state, action) => {
    state.loading = true
  },
  [upsert.rejected]: (state, action) => {
    state.loading = false
    show_under_form_fields(state.upsert, action.payload)
    console.error(action)
  },
  [upsert.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }

    state.upsert = {
      ...state.upsert,
      ...form.state,
    }

    if (_.hasIn(action.payload, "items")) {
      move_to_start(state, action.payload.items[0].uuid)
    }
  },

  // fetch_by_uuid
  [fetch_by_uuid.pending]: (state, action) => {
    state.loading = true
  },
  [fetch_by_uuid.rejected]: (state, action) => {
    state.loading = false
    console.error(action)
  },
  [fetch_by_uuid.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }
  },

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
