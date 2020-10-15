import _ from "lodash"
import axios from "axios"
import { createAsyncThunk } from '@reduxjs/toolkit'

import { needs_more } from "../../utils/table"
import { rsc_catched_error } from "../../utils/errors"

export default function(PREFIX, api, adapter) {
  const initialState = {
    loading: false,
    q: "",
    page: 0,
    per_page: 10,
    rsc: {
      page: 0,
      total: 0,
    }
  }

  function asyncActions(reducer_name, actions, afterCallbacks = {
    index: null,
  }) {
    /**
     * Get the next chunk for items when the requested page exceed the number
     * of cached items.
     */
    const index = createAsyncThunk(`${PREFIX}/index`, async (__, { dispatch, getState, rejectWithValue }) => {
      try {
        const state = getState()[reducer_name]

        let sorts = state.columns
            .filter(col => _.hasIn(col, "sort"))
            .sort((left, right) => {
              if (left.sortOrder > right.sortOrder) return 1
              else if (left.sortOrder < right.sortOrder) return -1
              return 0
            })
            .map(col => ({ name: col.slug, dir: col.sortDirection }))

        if (needs_more(state.ids.length, state.page, state.per_page)) {
          const response = await axios.post(api.index, {
            page: state.rsc.page + 1,
            q: state.q,
            sorts,
          })

          if (
            response.status === 200
            && _.hasIn(response.data, "items")
            && _.hasIn(response.data, "total")
          ) {
            if (response.data.items.length > 0) {
              dispatch(actions.upsertMany(response.data.items))
            }

            if (_.get(afterCallbacks, "index") !== null) {
              afterCallbacks.index(response.data.items)
            }

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

  /**
   * Table reducers.
   */
  const reducers = {
    upsertMany: adapter.upsertMany,
    updateMany: adapter.updateMany,
    updateOne: adapter.updateOne,
    removeAll: adapter.removeAll,
    softReset: (state, action) => {
      state.q = ""
      state.page = 0
    },
    setQ: (state, action) => {
      state.page = 0
      state.rsc.page = 0
      state.rsc.total = 0
      state.q = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPerPage: (state, action) => {
      state.per_page = action.payload
      state.page = 0
    },
    handleSort: (state, action) => {
      state.page = 0
      state.rsc.page = 0

      state.columns.map((col, idx) => {
        if (!_.hasIn(col, "sort")) {
          return col
        }

        if (col.slug === action.payload.slug) {
          col.sortOrder = 1
          col.sortDirection = col.sortDirection === "asc" ? "desc" : "asc"
          return col
        }

        if (!_.hasIn(col, "sortOrder")) {
          col.sortOrder = idx + 1
        }

        col.sortOrder += 1
        return col
      })
    }
  }

  /**
   * Table extra reducers.
   */
  const extraReducers = {
    // index
    [`${PREFIX}/index/pending`]: (state, action) => {
      state.loading = true
    },
    [`${PREFIX}/index/rejected`]: (state, action) => {
      state.loading = false
      console.error(action)
    },
    [`${PREFIX}/index/fulfilled`]: (state, action) => {
      state.loading = false

      if (_.hasIn(action.payload, "total")) {
        state.rsc.total = action.payload.total
      }

      if (_.hasIn(action.payload, "next_page")) {
        state.rsc.page = action.payload.next_page
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
