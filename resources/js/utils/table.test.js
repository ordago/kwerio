import { needs_more } from './table.js'

it("checks weather it needs more data", async () => {
  expect(needs_more(15, 3, 5)).toBe(true)
  expect(needs_more(0, 0, 10)).toBe(true)
  expect(needs_more(0, 1, 10)).toBe(true)
  expect(needs_more(11, 1, 10)).toBe(true)
  expect(needs_more(19, 2, 10)).toBe(true)
})
