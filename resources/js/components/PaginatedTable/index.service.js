import { needs_more, request_url } from "./utils.js"

export default ({ actions, api, primaryKey  }) => ({
  index: ({ params }) => {
    const req = params.requests.index

    return {
      url: (args) => request_url({ args, params, api, action: "index" }),
      method: req.method,
      cancelCallback: ({ state }) => ! needs_more(state.ids.length, state.page, state.per_page),
      data: (args) => {
        if (req.requestBody) {
          return req.requestBody(args)
        }

        let sorts = args.state.columns
          .filter(col => ("sort" in col) && col.sort === true)
          .sort((left, right) => {
            if (left.sortOrder > right.sortOrder) return 1
            else if (left.sortOrder < right.sortOrder) return -1
            return 0
          })
          .map(col => ({
            name: col.slug,
            dir: col.sortDirection || "asc",
          }))

        return {
          page: args.state.rsc.page + 1,
          q: args.state.q,
          sorts,
          ...req.extraParams,
        }
      },
      200: (args) => {
        const data = req.convertResponseBody ? req.convertResponseBody(args) : args.data
        args.dispatch(actions.upsertMany(data.items))
        return data
      }
    }
  },
})
