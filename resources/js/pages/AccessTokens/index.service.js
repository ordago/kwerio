import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

import { api } from "../../routes/app"
import { rsc_catched_error } from "../../utils/errors"
import { actions } from './index.slice.js'

export const PREFIX = "ACCESS_TOKENS"

export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const {
      uuid,
      name,
      is_hashed,
      expired_at,
    } = getState()["accessTokens"].upsert

    let endpoint = api.accessTokens.update

    if (_.isNull(uuid)) {
      endpoint = api.accessTokens.create
    }

    const response = await axios.post(endpoint, { uuid, name, is_hashed, expired_at })

    if (response.status === 200) {
      dispatch(actions.upsertOne({
        ...response.data.items[0],
        touched_at: Date.now(),
      }))
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})
