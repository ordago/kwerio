import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { api } from "../../routes/app"
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

    if (response.status === 200 && _.hasIn(response, "data")) {
      return response.data
    }
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
    console.log(action)
  }
}
