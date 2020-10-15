import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { actions, form } from "./index.slice"
import { api } from "../../routes/app"
import { move_to_start } from "../../utils/service"
import { rsc_catched_error ,show_under_form_fields } from "../../utils/errors"

export const PREFIX = "GROUPS"

export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const { uuid, name, modules } = getState().groups.upsert
    let endpoint = api.groups.update

    if (_.isNull(uuid)) {
      endpoint = api.groups.create
    }

    const response = await axios.post(endpoint, {
      name: name.value,
      modules: modules.value.map(module => module.uid),
    })

    if (response.status === 200 && _.hasIn(response.data, "total") && _.hasIn(response.data, "item")) {
      dispatch(actions.upsertOne({
        ...response.data.item,
        touched_at: Date.now(),
      }))

      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

export const extraReducers = {
  [upsert.pending]: (state, action) => {
    state.loading = true
  },
  [upsert.rejected]: (state, action) => {
    state.loading = false
    show_under_form_fields(state.upsert, action.payload)
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

    if (_.hasIn(action.payload, "item")) {
      move_to_start(state, action.payload.item.uuid)
    }
  }
}
