export default ({ actions, api, endpoints }) => ({
  metadata: ({ params }) => ({
    url: endpoint.metadata,
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

  upsert: () => ({
    url: api.create,
    data: ({ state }) => ({
      uuid: state.upsert.uuid,
      locale: state.upsert.locale.value,
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
        history.push(endpoints.index)
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
