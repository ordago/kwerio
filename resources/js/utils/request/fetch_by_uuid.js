import _ from "lodash"

export default function({
  actions,
  api,
  params,
}, {
  on200 = null,
  before200 = null,
  after200 = null,
} = {}) {
  let endpoint = api.fetch_by_uuid

  for (let key in params.substitute) {
    endpoint = endpoint.replace(`:${key}`, params.substitute[key])
  }

  return {
    url: endpoint,
    data: {
      uuid: params.uuid,
    },
    200: args => {
      if (on200) {
        return on200(args)
      }

      if (before200) {
        before200(args)
      }

      const { dispatch, data } = args

      dispatch(actions.upsertOne({ ...data.items[0] }))
      dispatch(actions.fillUpsert(data.items[0]))

      if (after200) {
        after200(args)
      }

      return data
    }
  }
}
