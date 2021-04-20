export const requestTemplate = {
  url: null,                        // Url.
  method: "post",                   // Method.
  requestBody: null,                // Body content.
  extraParams: {},                  // Additional params to append to body.
  convertResponseBody: null,        // Convert response body.
}

/**
 * Check if table needs more data.
 *
 * @return bool
 */
export function needs_more(available, page, per_page) {
  return available === 0 || (page + 1) * per_page >= available
}

/**
 * Build the request url.
 *
 * @return string
 */
export function request_url({ args, params, api, action }) {
  const req = params.requests[action]

  if (req.url) {
    if (typeof req.url === "function") {
      return req.url(args)
    }

    return req.url
  }

  return api[action]
}

/**
 * Override request body.
 *
 * @return object
 */
export function request_body({ args, params, api, action, fn = null }) {
  const req = params.requests[action]

  if (req.requestBody) {
    return req.requestBody(args)
  }

  if (fn) {
    return fn()
  }
}

/**
 * Overrides response body.
 *
 * @return object
 */
export function response_body({ args, action, fn = null, params }) {
  const req = params.requests[action]

  if (req.convertResponseBody) {
    return req.convertResponseBody(args)
  }

  if (fn) {
    return fn()
  }

  return args.data
}
