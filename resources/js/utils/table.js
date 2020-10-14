/**
 * Check if more data is needed.
 *
 * @param {integer}  available
 * @param {page}     page
 * @param {per_page} per_page
 * @return {boolean}
 */
export function needs_more(available, page, per_page) {
  return available === 0 || (page + 1) * per_page >= available
}
