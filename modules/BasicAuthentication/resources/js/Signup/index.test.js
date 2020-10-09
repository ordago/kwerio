import { act, Simulate } from "react-dom/test-utils"
import { render } from "react-dom"
import React from "react"
import axios from 'axios'

import Signup from "./index"

let container

function _get_elements() {
  return {
    email: document.getElementsByName("email")[0],
    pwd: document.getElementsByName("password")[0],
    conf_pwd: document.getElementsByName("password_confirmation")[0],
    btn: document.getElementsByName("signup_btn")[0],
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

it("Submits when client data is ok", () => {
  act(() => { render(<Signup />, container) })
  const { email, pwd, conf_pwd, btn } = _get_elements()
  email.value = "euvoor@gmail.com"
  Simulate.change(email)
  pwd.value = "secret"
  Simulate.change(pwd)
  conf_pwd.value = "secret"
  Simulate.change(conf_pwd)

  axios.post = jest.fn(() => Promise.resolve({}))
  Simulate.click(btn)
  expect(axios.post).toHaveBeenCalledTimes(1)
})

it("Does not submit when client data is invalid", () => {
  act(() => { render(<Signup />, container) })
  const { email, pwd, conf_pwd, btn } = _get_elements()
  email.value = "euvoor@gmail.com"
  Simulate.change(email)
  pwd.value = "secret"
  Simulate.change(pwd)
  conf_pwd.value = "xxx"
  Simulate.change(conf_pwd)

  axios.post = jest.fn(() => Promise.resolve({}))
  Simulate.click(btn)
  expect(axios.post).toHaveBeenCalledTimes(0)
})
