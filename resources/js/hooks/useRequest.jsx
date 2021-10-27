import { createAsyncThunk } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar  } from "notistack"
import qs from "qs"

import axios from "axios"

import { reject_with_error } from "../utils/errors"
import useT from "./useT"

/**
 * Parse url option.
 *
 * @param {object} options
 * @return string
 * @throws Error
 */
function _parse_url(options, args) {
  if (typeof options.url === "function") return options.url(args)
  else if (typeof options.url === "string") return options.url
  throw `Unsupported type of url: ${typeof options.url}`
}

/**
 * Parse method type.
 *
 * @param {object} options
 * @param {object} args
 * @return string
 * @throws Error
 */
function _parse_method(options, args) {
  if (typeof options.method === "function") return options.method(args)
  if (typeof options.method === "string") return options.method
  throw `Unsupported type of method: ${typeof options.method}`
}

/**
 * Parse request data.
 *
 * @param {object} options
 * @param {object} args
 * @return {mixed}
 */
function _parse_data(options, args) {
  if (typeof options.data === "string") return options.data

  let data = options.data

  if (typeof options.data === "function") {
    data = options.data(args)
  }

  if (options.method === "get" && typeof data !== "string") {
    return qs.stringify(data)
  }

  return data
}

/**
 * useRequest hook
 */
function useRequest({
  services,
  prefix = null,
  reducer = "module",
  primaryKey = "uuid",
}) {
  const dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    history = useHistory(),
    t = useT()

  let asyncActions = {}

  const defaultOptions = {
    url: null,                              // [REQUEST] Endpoint that the request will be sent to.
    method: "post",                         // Method to be in the request.
    notifySuccessMessage: true,             // Display a notification message on success.
    notifyFailedMessage: true,              // Display a notification message on failure.
    data: null,                             // Data to be sent in the request.
    cancelCallback: args => false,          // Do not do the request if cancel callback is true.
    beforeCallback: args => {},             // Callback before the request is sent.
    afterCallback: (response, args) => {},  // Callback after the request is sent.
    failedCallback: (error, args) => {},    // Callback if request failed.
    finallyCallback: args => {},            // Callback after everything is finished (finally).
  }

  if (!prefix) prefix = reducer

  for (let service in services) {
    asyncActions[service] = (params = {}) => dispatch(createAsyncThunk(
      `${prefix}/${service}`,
      async (__, { dispatch, getState, rejectWithValue }) => {
        let asyncAction = services[service]({
          params,
          dispatch,
          state: getState(),
          rejectWithValue,
        })

        const args = {
          params,                       // The parameters sent when calling request.
          dispatch,                     // Redux dispatch.
          getState,                     // Redux state.
          rejectWithValue,              // Reduxjs toolkit rejectWithValue.
          reducer,                      // Name of the reducer.
          state: getState()[reducer],   // State of the current reducer.
          history,
          primaryKey,
        },
          options = {
            ...defaultOptions,          // Seed default options
            ...services[service](args), // Custom user configuration.
          }

        options.beforeCallback(args)

        try {
          // Send HTTP request to options.url..
          const response = await axios({
            url: _parse_url(options, args),
            method: _parse_method(options, args),
            data: _parse_data(options, args)
          })

          options.afterCallback(response, args)

          // Call option[status] if available..
          let status_handled = false,
            status_results = null

          if (response.status in options) {
            status_results = options[response.status]({ data: response.data, ...args })
            status_handled = true
          }

          // Display success message, if any..
          if (options.notifySuccessMessage) {
            let message = null,
              variant = "default"

            if ("message" in response.data) {
              message = response.data.message
              variant = ("variant" in response.data) ? response.data.variant : variant
            } else if (status_handled && status_results && ("message" in status_results)) {
              message = status_results.message
              variant = ("variant" in status_results) ? status_results.variant : variant
            }

            if (message) {
              enqueueSnackbar(t(message), { variant })
            }
          }

          if (status_handled) {
            return status_results
          }

          return response.data
        }

        catch (err) {
          options.failedCallback(err, args)

          // Display error message if any..
          if (options.notifyFailedMessage) {
            if (typeof err === "string") {
              console.error(err)
            } else if ("response" in err) {
              let message = ("message" in err.response.data) && err.response.data.message

              if (message.trim().length === 0) {
                message = `${err.response.status} ${err.response.statusText}`
              }

              const variant = ("variant" in err.response.data) ? err.response.data.variant : "error"

              enqueueSnackbar(t(message), { variant })

              // Call option[status] if available..
              if (err.response.status in options) {
                return options[err.response.status]({ response: err.response, error: err, ...args })
              }
            } else {
              console.error(err)
            }
          }

          return reject_with_error(err, rejectWithValue)
        }

        finally {
          options.finallyCallback(args)
        }
      }, {
        condition: (__, { getState, extra }) => {
          const args = {
            params,
            getState,
            dispatch,
            state: getState()[reducer],
          }

          const item = {
            ...defaultOptions,
            ...services[service](args),
          }

          return ! item.cancelCallback(args)
        }
      }
    )())
  }

  return asyncActions
}

export default useRequest
