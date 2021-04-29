import _ from "lodash"

export const fillUpsert = (state, action) => {
  const item = action.payload

  for (let key in item) {
    if (key in state.upsert) {
      if (_.isObject(state.upsert[key]) && ("value" in state.upsert[key])) {
        state.upsert[key].value = item[key]
      } else {
        state.upsert[key] = item[key]
      }
    }
  }
}

export const resetUpsert = (state, form, appends = {}) => {
  state.upsert = {
    uuid: null,
    ...form.state,
    ...appends,
  }
}

export default {
  reducers: {
    fillUpsert,
    resetUpsert,
  },
}
