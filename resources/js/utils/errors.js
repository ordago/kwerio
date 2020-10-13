import _ from 'lodash'

/**
 * Map each error to its equivalent field.
 *
 * @param {object} data
 * @return {object}
 *   Can be passed to @euvoor/form to display errors under each field.
 */
function map_field_to_str(data) {
  const errors = _.get(data, "errors", {})
  let maps = {}

  _.forIn(errors, (messages, field) => {
    maps[field] = _.join(messages, '. ')
  })

  return maps
}

/**
 * Get the response error message.
 *
 * @param {object} data
 * @return {string}
 *   Can be used to show a notification to the user.
 */
function message(data) {
  return _.get(data, "message", "")
}

/**
 * Get all errors as a single string.
 *
 * @param {object} data
 * @return {string
 *   Can be used to display a long detailed notification to the user.
 */
function errors_to_str(data) {
  const errors = _.get(data, "errors", {})
  let messages = []

  _.forIn(errors, (data) => {
    messages.push(_.join(data, '. '))
  })

  return _.join(messages, ". ")
}

export default {
  map_field_to_str,
  message,
  errors_to_str,
}
