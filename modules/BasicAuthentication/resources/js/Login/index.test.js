import { act, Simulate } from "react-dom/test-utils"
import { render } from "react-dom"
import React from "react"
import axios from 'axios'

import Login from "./"

let container

function _get_elements() {
  return {
    email: document.getElementsByName("email")[0],
    pwd: document.getElementsByName("password")[0],
    btn: document.getElementsByName("submit")[0],
  }
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

it("logs the user in", () => {
  act(() => { render(<Login />, container) })
  const { email, pwd, btn } = _get_elements()

  email.value = "euvoor@gmail.com"
  Simulate.change(email)

  pwd.value = "secret"
  Simulate.change(email)

  axios.post = jest.fn(() => Promise.resolve({}))
  Simulate.click(btn)
  expect(axios.post).toHaveBeenCalledTimes(1)
})
