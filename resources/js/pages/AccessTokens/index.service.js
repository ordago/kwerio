import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios'

import { api } from "../../routes/app"
import { rsc_catched_error } from "../../utils/errors"
import { actions } from './index.slice.js'

export const PREFIX = "ACCESS_TOKEKNS"

export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const { uuid } = getState()["accessTokens"].upsert

    let endpoint = api.accessTokens.update

    if (_.isNull(uuid)) {
      endpoint = api.accessTokens.create
    }

    dispatch(actions.setLoading(true))

    const response = await axios.post(endpoint)

    console.log(response)
  }

  catch (err) {
    console.error(err)
    return rsc_catched_error(err, rejectWithValue)
  }

  finally {
    dispatch(actions.setLoading(false))
  }
})
