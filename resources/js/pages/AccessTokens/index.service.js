import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

import { api } from "../../routes/app"
import { rsc_catched_error } from "../../utils/errors"
import { actions } from './index.slice.js'

export const PREFIX = "ACCESS_TOKENS"

export const fetch_by_uuid = createAsyncThunk(`${PREFIX}/fetch-by-uuid`, async (uuid, { dispatch, getState, rejectWithValue }) => {
  try {
    const response = await axios.post(api.accessTokens.fetch_by_uuid, { uuid })

    if (response.status === 200) {
      dispatch(actions.upsertOne({ ...response.data.items[0] }))
      dispatch(actions.fillUpsert(response.data.items[0]))
      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (original_token, { dispatch, getState, rejectWithValue }) => {
  try {
    const {
      uuid,
      name,
      is_hashed,
      expired_at,
    } = getState()["accessTokens"].upsert

    let endpoint = api.accessTokens.update

    if (!uuid) {
      endpoint = api.accessTokens.create
    }

    const response = await axios.post(endpoint, { uuid, name, is_hashed, expired_at, original_token })

    if (response.status === 200) {
      dispatch(actions.upsertOne({
        ...response.data.items[0],
        touched_at: Date.now(),
      }))

      dispatch(actions.fillUpsert(response.data.items[0]))

      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})
