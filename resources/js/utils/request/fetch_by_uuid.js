import _ from "lodash"

export default function({ actions, api, params }) {
  let endpoint = api.fetch_by_uuid

  for (let key in params.substitute) {
    endpoint = endpoint.replace(`:${key}`, params.substitute[key])
  }

  return {
    url: endpoint,
    data: {
      uuid: params.uuid,
    },
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertOne({ ...data.items[0] }))
      dispatch(actions.fillUpsert(data.items[0]))

      return data
    }
  }
}
