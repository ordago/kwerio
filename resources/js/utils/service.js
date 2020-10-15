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
