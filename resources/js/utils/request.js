export function upsert_url(api, { state, primaryKey }) {
  if (state.upsert[primaryKey]) {
    const re = new RegExp(`:${primaryKey}`)

    return api.update
  }

  return api.create
}

export function upsert_route_to_index(actions, endpoint, { dispatch, data, history, state, primaryKey }) {
  const route_to_index = ! state.upsert[primaryKey]

  dispatch(actions.upsertOne({ ...data.items[0], touched: Date.now() }))
  dispatch(actions.resetTableTrackers())

  if (route_to_index) {
    dispatch(actions.resetUpsert())
    history.push(endpoint.index)
  } else {
    dispatch(actions.fillUpsert(data.items[0]))
  }

  return data
}

export function fetch_by_uuid(actions, api, params) {
  return {
    url: api.fetch_by_uuid,
    data: {
      uuid: params,
    },
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertOne({ ...data.items[0] }))
      dispatch(actions.fillUpsert(data.items[0]))

      return data
    }
  }
}
