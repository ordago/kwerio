import _ from 'lodash'

/**
 * Check if service needs to fetch more data.
 *
 * @param {object}  state
 * @param {object}  adapter
 * @return {boolean}
 */
export function needs_more(state, adapter) {
  const selector = adapter.getSelectors(),
    data = selector.selectAll(state)

  return state.rsc.total === 0 || state.rsc.total < data.length
}

/**
 * Move the given entity id to the begining.
 *
 * @param {object} state
 * @param {mixed}  id
 */
export function move_to_start(state, id) {
  if (!_.hasIn(state, "ids")) {
    throw new Error("State does not have entity 'ids'")
  }

  if (state.ids.length < 2) return

  let idx = null

  for (let i = 0; i < state.ids.length; i ++) {
    if (state.ids[i] === id) {
      idx = i
      break
    }
  }

  if (_.isNull(idx)) {
    throw new Error(`${id} is not found in state.ids`)
  }

  if (idx === 0) return

  state.ids.unshift(state.ids.splice(idx, 1)[0])
}
