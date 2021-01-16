export default (prefix, services, overrides = {}) => {
  let extraReducers = {}

  if (typeof services === "function") {
    services = services({})
  }

  for (let service in services) {
    extraReducers[`${prefix}/${service}/pending`] = (state, action) => {
      state.error = false
      state.loading = true

      if ((service in overrides) && ("pending" in overrides[service])) {
        overrides[service].pending(state, action)
      }
    }

    extraReducers[`${prefix}/${service}/rejected`] = (state, action) => {
      console.error(action)

      if (("error" in action) && ("stack" in action.error)) {
        console.log(action.error.stack)
      }

      state.error = true
      state.loading = false

      if ((service in overrides) && ("rejected" in overrides[service])) {
        overrides[service].rejected(state, action)
      }
    }

    extraReducers[`${prefix}/${service}/fulfilled`] = (state, action) => {
      state.error = false
      state.loading = false

      if ((service in overrides) && ("fulfilled" in overrides[service])) {
        overrides[service].fulfilled(state, action)
      }
    }
  }

  return extraReducers
}
