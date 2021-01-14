import _ from "lodash"
import generate_extra_reducers from '../../utils/generate-extra-reducers.js'

/**
 * Check if table needs more data.
 *
 * @param {integer} available
 * @param {integer} page
 * @param {integer} per_page
 * @return bool
 */
function needs_more(available, page, per_page) {
  return available === 0 || (page + 1) * per_page >= available
}

export const initialState = {
  loading: false,
  q: "",
  page: 0,
  per_page: 10,
  rsc: {
    page: 0,
    total: 0,
  }
}

export const init_services = (api, actions) => ({
  index: () => ({
    url: api.index,
    cancelCallback: ({ state }) => ! needs_more(state.ids.length, state.page, state.per_page),
    data: ({ state }) => {
      let sorts = state.columns
        .filter(col => ("sort" in col) && col.sort === true)
        .sort((left, right) => {
          if (left.sortOrder > right.sortOrder) return 1
          else if (left.sortOrder < right.sortOrder) return -1
          return 0
        })
        .map(col => ({ name: col.slug, dir: col.sortDirection }))

      return {
        page: state.rsc.page + 1,
        q: state.q,
        sorts,
      }
    },
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertMany(data.items))
      return data
    }
  }),
})

export const init_reducers = (adapter) => ({
  upsertMany: adapter.upsertMany,
  upsertOne: adapter.upsertOne,
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
})

export const init_extraReducers = (prefix) => generate_extra_reducers(prefix, { index: [] }, {
  index: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
      state.rsc.page = action.payload.next_page - 1
    }
  }
})

export default {
  initialState,
  init_services,
  init_reducers,
  init_extraReducers,
}
