import { createAsyncThunk } from "@reduxjs/toolkit"

import _ from "lodash"
import axios from "axios"

export default function(api, prefix) {
  const initialState = {
    q: "",
    page: 0,
    last_page: 1,
    current_page: 0,
    per_page: 10,
    from: 1,
    to: 1,
    total: 1,
    data: [],
    nb_checked: 0,
    all_checked: false,
    sorts: [],
    columns: [],
  }

  function asyncActions(reducer_name, slice) {
    /**
     * Get paginated items for the given slice.
     */
    const index = createAsyncThunk(`${prefix}.index`, async (opt, { dispatch, getState }) => {
      let { page, per_page, q, sorts } = getState()[reducer_name],
        params = {}

      if (_.hasIn(opt, "page")) page = opt.page
      if (_.hasIn(opt, "per_page")) per_page = opt.per_page
      if (_.hasIn(opt, "q")) q = opt.q
      if (_.hasIn(opt, "params")) params = opt.params

      page += 1

      return (await axios.post(api.index, { page, per_page, q, sorts, ...params })).data
    })

    /**
     * Sort the table by the given field.
     */
    const sortBy = createAsyncThunk(`${prefix}.sortBy`, async ({ slug, direction }, { dispatch, getState }) => {
      direction = direction === "desc" ? "asc" : "desc"

      let oldSorts = getState()[reducer_name].sorts
      let sorts = []

      sorts.push({ slug, direction })

      for (let i = 0; i < oldSorts.length; i ++) {
        if (oldSorts[i].slug === slug) continue
        sorts.push(oldSorts[i])
      }

      dispatch(slice.actions.setColumnSort({ slug, direction }))
      dispatch(slice.actions.setSorts(sorts))
      dispatch(index({ page: 0 }))
    })

    /**
     * @deprecated
     */
    const duplicate = createAsyncThunk(`${prefix}.duplicate`, async (_, { dispatch, getState }) => {
      const { data, current_page } = getState()[reducer_name],
        items = data.filter(item => item.checked)

      let uuids = []

      for (let i = 0; i < items.length; i ++) {
        uuids.push(items[i].uuid)
      }

      await axios.post(api.duplicate, { data: uuids })

      dispatch(index({ page: current_page }))
    })

    /**
     * @deprecated
     */
    const remove = createAsyncThunk(`${prefix}.remove`, async (_, { dispatch, getState }) => {
      const { data, current_page } = getState()[reducer_name],
        items = data.filter(item => item.checked)

      let uuids = []

      for (let i = 0; i < items.length; i ++) {
        uuids.push(items[i].uuid)
      }

      await axios.post(api.remove, { data: uuids })

      dispatch(index({ page: current_page }))
    })

    /**
     * Fetch items of the given page.
     */
    const onChangePage = createAsyncThunk(`${prefix}.onChangePage`, async (page, { dispatch, getState }) => {
      dispatch(index({ page }))
    })

    /**
     * Number of items to display is changed.
     */
    const onChangeRowsPerPage = createAsyncThunk("onChangeRowsPerPage", async (per_page, { dispatch, getState }) => {
      dispatch(index({ page: 0, per_page }))
    })

    /**
     * Search by the given query.
     */
    const onQChange = createAsyncThunk(`${prefix}.onQChange`, async (q, { dispatch }) => {
      dispatch(slice.actions.setQ(q))
      dispatch(index({ q, page: 0 }))
    })

    return {
      index,
      sortBy,
      duplicate,
      remove,
      onChangePage,
      onChangeRowsPerPage,
      onQChange,
    }
  }

  const reducers = {
    setColumnSort: (state, action) => {
      state.columns.map(col => {
        if (col.slug === action.payload.slug) {
          col.sortDirection = action.payload.direction
        }
        return col
      })
    },

    setSorts: (state, action) => {
      state.sorts = action.payload
    },

    setQ: (state, action) => {
      state.q = action.payload
    },

    toggleCheckAll: (state, action) => {
      state.data.map(item => item.checked = action.payload)
      state.all_checked = action.payload
      state.nb_checked = action.payload ? state.data.length : 0
    },

    toggleCheck: (state, action) => {
      state.data.map(item => {
        if (item.uuid === action.payload.uuid) item.checked = action.payload.checked
          return item
      })
      state.nb_checked = state.data.filter(item => item.checked).length

      if (state.nb_checked === state.data.length) state.all_checked = true
      else state.all_checked = false
    },
  }

  const extraReducers = {
    [`${prefix}.index/fulfilled`]: (state, action) => {
      state.nb_checked = 0
      state.all_checked = false
      state.page = action.payload.current_page
      state.last_page = action.payload.last_page
      state.current_page = action.payload.current_page - 1
      state.per_page = action.payload.per_page
      state.from = action.payload.from
      state.to = action.payload.to
      state.total = action.payload.total
      state.data = action.payload.data
    },
    [`${prefix}.index/pending`]: (state, action) => {

    },
    [`${prefix}.index/rejected`]: (state, action) => {
      console.error(action)
    },
  }

  return {
    initialState,
    asyncActions,
    reducers,
    extraReducers,
  }
}
