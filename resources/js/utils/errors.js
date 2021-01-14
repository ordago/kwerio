import _ from 'lodash'

/**
 * Show a notification error (snackbar) to the user.
 *
 * @param {object} action
 * @param {callback} enqueueSnackbar
 */
export function notify(action, enqueueSnackbar) {
  let error_msg = _.get(action, "error.message")

  if (error_msg === "Rejected" && _.hasIn(action, "payload.message")) {
    enqueueSnackbar(message(action.payload), { variant: "error" })
  }

  else if (error_msg === "Rejected") {
    enqueueSnackbar(action.payload, { variant: "error" })
  }

  else {
    return action
  }
}

/**
 * Handle a catched err from an ajax request.
 *
 * @param {Error} err
 * @param {callback} rejectWithValue
 * @return {mixed}
 * @throws {Error}
 */
export function reject_with_error(err, rejectWithValue) {
  if (_.hasIn(err, "response.data")) {
    return rejectWithValue(err.response.data)
  }

  return rejectWithValue(err.message)
}

/**
 * Map each error to its equivalent field.
 *
 * @param {object} data
 * @return {object}
 *   Can be passed to @euvoor/form to display errors under each field.
 */
export function map_field_to_str(data) {
  const errors = _.get(data, "errors", {})
  let maps = {}

  _.forIn(errors, (messages, field) => {
    maps[field] = _.join(messages, '. ')
  })

  return maps
}

/**
 * Show errors under there equivalent field.
 *
 * @param {object} state
 * @param {object} data
 */
export function show_under_form_fields(state, data) {
  const errors = map_field_to_str(data)

  _.forIn(errors, (msg, key) => {
    if (_.hasIn(state, key)) {
      state[key].helper_text = msg
      state[key].error = true
    }
  })
}

/**
 * Get the response error message.
 *
 * @param {object} data
 * @return {string}
 *   Can be used to show a notification to the user.
 */
export function message(data) {
  return _.get(data, "message", "")
}

/**
 * Get all errors as a single string.
 *
 * @param {object} data
 * @return {string
 *   Can be used to display a long detailed notification to the user.
 */
export function errors_to_str(data) {
  const errors = _.get(data, "errors", {})
  let messages = []

  _.forIn(errors, (data) => {
    messages.push(_.join(data, '. '))
  })

  return _.join(messages, ". ")
}
