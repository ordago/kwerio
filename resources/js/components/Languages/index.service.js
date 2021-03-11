export default ({ actions, api, endpoint }) => ({
  metadata: ({ params }) => ({
    url: api.metadata,
    cancelCallback: ({ state }) => state.languages.length > 0,
    data: {
      ...params,
    },
    200: ({ data, dispatch }) => {
      if (params && ("only_models" in params)) {
        dispatch(actions.upsertMany(data.items))
        dispatch(actions.loaded())
      }

      return data
    },
  }),

  upsert: ({ params }) => ({
    url: api.create,
    data: ({ state }) => ({
      uuid: state.upsert.uuid,
      locale: state.upsert.locale.value,
      ...params,
    }),
    200: ({ data, dispatch, state, history }) => {
      const route_to_index = ! state.upsert.uuid

      dispatch(actions.upsertOne({ ...data.items[0], touched_at: Date.now() }))
      dispatch(actions.resetTableTrackers())
      dispatch(actions.setLanguagesDisabledTo({
        items: data.items,
        disabled: true,
      }))

      if (route_to_index) {
        dispatch(actions.resetUpsert())
        history.push(endpoint.index)
      } else {
        dispatch(actions.fillUpsert(data.items[0]))
      }

      return data
    }
  }),

  setAsDefault: ({ params }) => ({
    url: api.set_as_default,
    data: {
      uuid: params.uuid,
    },
    200: ({ data, dispatch }) => {
      dispatch(actions.upsertMany(data.items.map(item => {
        item.checked = false
        return item
      })))

      return data
    },
  }),
})
