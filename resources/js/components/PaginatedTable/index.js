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
  index: ({ params }) => ({
    url: (args) => params.requests.index.url ? params.requests.index.url(args) : api.index,
    method: params.requests.index.method,
    cancelCallback: ({ state }) => ! needs_more(state.ids.length, state.page, state.per_page),
    data: (args) => {
      if (params.requests.index.requestBody) {
        return params.requests.index.requestBody(args)
      }

      let sorts = args.state.columns
        .filter(col => ("sort" in col) && col.sort === true)
        .sort((left, right) => {
          if (left.sortOrder > right.sortOrder) return 1
          else if (left.sortOrder < right.sortOrder) return -1
          return 0
        })
        .map(col => ({ name: col.slug, dir: col.sortDirection }))

      return {
        page: args.state.rsc.page + 1,
        q: args.state.q,
        sorts,
      }
    },
    200: (args) => {
      const data = params.requests.index.convertResponseBody ? params.requests.index.convertResponseBody(args) : args.data
      args.dispatch(actions.upsertMany(data.items))
      return data
    }
  }),

  delete: ({ params }) => ({
    url: (args) => params.requests.delete.url ? params.requests.delete.url(args) : api.delete,
    method: params.requests.delete.method,
    data: (args) => {

    },
    200: (args) => {
      const data = params.requests.delete.convertResponseBody ? params.requests.delete.convertResponseBody(args) : args.data
      args.dispatch(actions.removeMany(data.items))
      return data
    },
  })
})

export const init_reducers = (adapter) => ({
  addMany: adapter.addMany,
  addOne: adapter.addOne,
  removeAll: adapter.removeAll,
  removeMany: adapter.removeMany,
  removeOne: adapter.removeOne,
  setAll: adapter.setAll,
  updateMany: adapter.updateMany,
  updateOne: adapter.updateOne,
  upsertMany: adapter.upsertMany,
  upsertOne: adapter.upsertOne,

  resetTableTrackers: (state, action) => {
    state.q = ""
    state.page = 0
  },
  moveTouchedToStart: (state, action) => {
    let entities = []

    for (let i = 0; i < state.ids.length; i ++) {
      let entity = state.entities[state.ids[i]]

      if ("touched_at" in entity) {
        entities.push({ touched_at: entity.touched_at, idx: i })
      }
    }

    entities.sort((a, b) => a.touched_at - b.touched_at)

    for (let i = 0; i < entities.length; i ++) {
      state.ids.unshift(state.ids.splice(entities[i].idx, 1)[0])
    }
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

export const init_extraReducers = (prefix) => generate_extra_reducers(prefix, init_services(), {
  index: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
      state.rsc.page = action.payload.next_page - 1
    },
  },
  delete: {
    fulfilled: (state, action) => {
      state.rsc.total = action.payload.total
    },
  },
})

export default {
  initialState,
  init_services,
  init_reducers,
  init_extraReducers,
}
