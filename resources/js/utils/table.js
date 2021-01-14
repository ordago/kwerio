import _ from "lodash"

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
