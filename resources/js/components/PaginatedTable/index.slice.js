import { createAsyncThunk } from "@reduxjs/toolkit"
import generate_extra_reducers from "../../utils/generate-extra-reducers"

/**
 * Initiale state of the table.
 */
export const state = {
  loading: false,
  q: "",
  page: 0,
  per_page: 10,
  rsc: {
    page: 0,
    total: 0,
  }
}

/**
 * Append these reducers to the component slice using the paginated table.
 */
export const reducers = adapter => ({
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
      if (!("sort" in col)) {
        return col
      }

      if (col.slug === action.payload.slug) {
        col.sortOrder = 1
        if (!col.sortDirection) {
          col.sortDirection = "desc"
        } else {
          col.sortDirection = col.sortDirection === "asc" ? "desc" : "asc"
        }

        return col
      }

      if (!("sortOrder" in col)) {
        col.sortOrder = idx + 1
      }

      col.sortOrder += 1
      return col
    })
  }
})

export const markAsTouched = createAsyncThunk(`PaginatedTable/markAsTouched`, async (items, { dispatch }) => {
  console.log(items)
})

/**
 * Append them to the extraReducers of the component slice using the table.
 */
export const extraReducers = prefix => generate_extra_reducers(
  prefix,
  ["index"],
  {
    index: {
      fulfilled: (state, action) => {
        state.rsc.total = action.payload.total
        state.rsc.page = action.payload.next_page - 1
      },
    },
  }
)

export default {
  state,
  reducers,
  extraReducers,
}
