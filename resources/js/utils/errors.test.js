import errors from './errors.js'
import axios from 'axios'

it("extract errors from response and map them to fields names", async () => {
  axios.post = jest.fn(() => Promise.resolve({
    message: "The given data was invalid.",
    errors: {
      name:[
        "The name field is required",
        "The name field is duplicated",
      ],
      email: [
        "The email field is not valid",
      ],
    }
  }))

  const data = await axios.post("/api")
  const actual = errors.map_field_to_str(data)

  expect(actual).toStrictEqual({
    name: "The name field is required. The name field is duplicated",
    email: "The email field is not valid",
  })
})

it("extract response error message", async () => {
  axios.post = jest.fn(() => Promise.resolve({
    message: "The given data was invalid",
    errors: {}
  }))

  const data = await axios.post("/api")

  expect(errors.message(data)).toEqual("The given data was invalid")
})

it("concatenate all errors messages", async () => {
  axios.post = jest.fn(() => Promise.resolve({
    message: "The given data was invalid.",
    errors: {
      name:[
        "The name field is required",
        "The name field is duplicated",
      ],
      email: [
        "The email field is not valid",
      ],
    }
  }))

  const data = await axios.post("/api")

  expect(errors.errors_to_str(data)).toStrictEqual("The name field is required. The name field is duplicated. The email field is not valid")
})
