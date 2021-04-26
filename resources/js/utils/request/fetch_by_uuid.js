export default function({ actions, api, params }) {
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
