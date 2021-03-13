/**
 * Generate extraReducers for the given services, that change loading and
 * error state of a request on the fly.
 *
 * Custom changes can be added by setting additionalChange property with
 * the name of the service and the stage you want to add change to.
 *
 * The default attributes are:
 *
 *  - error    set to true when failed
 *  - loading  the current state of loading
 *  - touched  is only set the first time on successful load
 *
 * TODO
 * Use requestId to keep track of error, loading and touched for better ui.
 */
export default (prefix, services, additionalChange = {}) => {
  let extraReducers = {}

  if (typeof services === "function") {
    services = services({})
  }

  if (!Array.isArray(services) && (typeof services === "object")) {
    services = Object.keys(services)
  }

  for (let i = 0; i < services.length; i ++) {
    let service = services[i]

    // Pending.
    extraReducers[`${prefix}/${service}/pending`] = (state, action) => {
      state.error = false
      state.loading = true

      if (!state.touched) {
        state.touched = false
      }

      if ((service in additionalChange) && ("pending" in additionalChange[service])) {
        additionalChange[service].pending(state, action)
      }
    }

    // Rejected.
    extraReducers[`${prefix}/${service}/rejected`] = (state, action) => {
      console.error(action)

      if (("error" in action) && ("stack" in action.error)) {
        console.log(action.error.stack)
      }

      state.error = true
      state.loading = false

      if ((service in additionalChange) && ("rejected" in additionalChange[service])) {
        additionalChange[service].rejected(state, action)
      }
    }

    // Fulfilled.
    extraReducers[`${prefix}/${service}/fulfilled`] = (state, action) => {
      state.error = false
      state.loading = false
      state.touched = true

      if ((service in additionalChange) && ("fulfilled" in additionalChange[service])) {
        additionalChange[service].fulfilled(state, action)
      }
    }
  }

  return extraReducers
}
