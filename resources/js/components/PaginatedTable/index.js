import _ from "lodash"
import axios from "axios"
import { createAsyncThunk } from '@reduxjs/toolkit'

import { needs_more } from "../../utils/table"
import { rsc_catched_error } from "../../utils/errors"

export default function(PREFIX, api, adapter) {
  const initialState = {
    loading: "idle",
    page: 0,
    per_page: 10,
    rsc: {
      page: 0,
      total: 0,
    }
  }

  function asyncActions(reducer_name, actions) {
    /**
     * Get the next chunk for items when the requested page exceed the number
     * of cached items.
     */
    const index = createAsyncThunk(`${PREFIX}/index`, async (__, { dispatch, getState, rejectWithValue }) => {
      try {
        const state = getState()[reducer_name]

        if (needs_more(state.ids.length, state.page, state.per_page)) {
          const response = await axios.post(api.index, {
            page: state.rsc.page + 1,
          })

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
      }

      catch (err) {
        return rsc_catched_error(err, rejectWithValue)
      }
    })

    /**
     * Handle page change.
     *
     * @param {integer} page
     */
    const onChangePage = createAsyncThunk(`${PREFIX}.onChangePage`, async (page, { dispatch, getState }) => {
      dispatch(actions.setPage(page))
      dispatch(index())
    })

    /**
     * Number of items to display is changed.
     */
    const onChangeRowsPerPage = createAsyncThunk("onChangeRowsPerPage", async (per_page, { dispatch, getState }) => {
      dispatch(actions.setPerPage(per_page))
      dispatch(index())
    })

    return {
      index,
      onChangePage,
      onChangeRowsPerPage,
    }
  }

  const reducers = {
    upsertMany: adapter.upsertMany,
    updateMany: adapter.updateMany,
    updateOne: adapter.updateOne,
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPerPage: (state, action) => {
      state.per_page = action.payload
      state.page = 0
    },
  }

  const extraReducers = {
    // index
    [`${PREFIX}/index/pending`]: (state, action) => {
      state.loading = "pending"
    },
    [`${PREFIX}/index/rejected`]: (state, action) => {
      state.loading = "idle"
      console.error(action)
    },
    [`${PREFIX}/index/fulfilled`]: (state, action) => {
      state.loading = "idle"

      if (_.hasIn(action.payload, "total")) {
        state.rsc.total = action.payload.total
      }

      if (_.hasIn(action.payload, "items") && action.payload.items.length > 0) {
        state.rsc.page += 1
      }
    }
  }

  return {
    initialState,
    asyncActions,
    extraReducers,
    reducers,
  }
}
