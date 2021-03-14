import _ from "lodash"

import { request_url, request_body, response_body } from "../utils"

/**
 * Generate a body that is aimed to do action on a list of specific items.
 *
 * @return object
 */
function _primary_key_body({ params, primaryKey, action }) {
  return () => ({
    [`${primaryKey}s`]: params.items.map(item => item[primaryKey]),
    ...params.requests[action].extraParams,
  })
}

export default ({ actions, api, endpoint }) => ({
  /** DELETE */
  delete: ({ params }) => ({
    url: (args) => request_url({ args, params, api, action: "delete" }),
    method: params.requests.delete.method,
    data: (args) => request_body({
      args, params, api, action: "delete",
      fn: _primary_key_body({ params, primaryKey, action: "delete" })
    }),
    200: args => {
      const data = response_body({ args, action: "delete" }),
        items = _.get(data, "items", []).map(item => _.get(item, primaryKey, item))

      args.dispatch(actions.removeMany(items))

      return data
    },
  }),

  /** DISABLE */
  disable: ({ params }) => ({
    url: (args) => request_url({ args, params, api, action: "disable" }),
    method: params.requests.disable.method,
    data: args => request_body({
      args, params, api, action: "disable",
      fn: _primary_key_body({ params, primaryKey, action: "disable" }),
    }),
    200: (args) => {
      console.log(args.data)
    },
  }),

  /** ENABLE */
  enable: ({ params }) => ({
    url: args => request_url({ args, params, api, action: "enable" }),
    method: params.requests.disable.method,
    data: args => request_body({
      args, params, api, action: "enable",
      fn: _primary_key_body({ params, primaryKey, action: "enable" }),
    }),
    200: args => {
      console.log(args.data)
    },
  }),

  /** DUPLICATE */
  duplicate: ({ params }) => ({
    url: args => request_url({ args, api, params, action: "duplicate" }),
    method: params.requests.duplicate.method,
    data: args => request_body({
      args, params, api, action: "duplicate",
      fn: _primary_key_body({ params, primaryKey, action: "duplicate" }),
    }),
    200: args => {
      const data = response_body({ args, action: "duplicate" })
        items = data.items.map(item => {
          item.touched_at = Date.now()
          return item
        })

      args.dispatch(actions.upsertMany(data.items))
      args.dispatch(actions.moveTouchedToStart())

      return data
    }
  })
})
