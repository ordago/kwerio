import { createAsyncThunk } from "@reduxjs/toolkit"

import _ from "lodash"
import axios from "axios"

import { actions as abilitiesActions } from "../Abilities/index.slice"
import { actions } from "./index.slice"
import { api } from "../../routes/app"
import { form } from "../Users/index.slice"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"
import { move_to_start } from "../../utils/service"
import { rsc_catched_error, show_under_form_fields } from "../../utils/errors"

export const PREFIX = "USERS"

export const metadata = createAsyncThunk(`${PREFIX}/metadata`, async (uuid, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState().users

    if (state.languages.length === 0 || state.timezones.length === 0) {
      const response = await axios.post(api.users.metadata)

      if (response.status === 200) {
        if (_.hasIn(response.data, "groups")) {
          dispatch(groupsActions.upsertMany(response.data.groups.items))
          dispatch(groupsActions.updateRscTotal(response.data.groups.total))
        }

        if (_.hasIn(response.data, "modules")) {
          dispatch(modulesActions.upsertMany(response.data.modules.items))
          dispatch(modulesActions.updateRscTotal(response.data.modules.total))
        }

        if (_.hasIn(response.data, "abilities")) {
          dispatch(abilitiesActions.upsertMany(response.data.abilities.items))
          dispatch(abilitiesActions.updateRscTotal(response.data.abilities.total))
        }

        return response.data
      }

      return rejectWithValue(response.data)
    }
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

/**
 * Fetch user by uuid.
 */
export const fetch_by_uuid = createAsyncThunk(`${PREFIX}/fetch_by_uuid`, async (uuid, { getState, dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(api.users.fetch_by_uuid, { uuid })

    if (response.status === 200 ) {
        dispatch(actions.upsertOne({ ...response.data.items[0] }))
        dispatch(actions.fillUpsert(response.data.items[0]))
        return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

/**
 * Update or insert new user.
 */
export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (__, { dispatch, getState, rejectWithValue }) => {
  try {
    const {
      uuid,
      email,
      first_name,
      last_name,
      locale,
      timezone,
      locale_iso_format,
      password,
      password_confirmation,
      groups,
      abilities,
    } = getState().users.upsert

    let endpoint = api.users.update

    if (_.isNull(uuid)) {
      endpoint = api.users.create
    }

    const response = await axios.post(endpoint, {
      uuid,
      email: email.value,
      first_name: first_name.value,
      last_name: last_name.value,
      locale: locale.value,
      timezone: timezone.value,
      locale_iso_format: locale_iso_format.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      groups: groups.value,
      abilities: abilities.value,
    })

    if (response.status === 200 ) {
      if (response.data.items.length === 1) {
        dispatch(actions.upsertOne({
          ...response.data.items[0],
          touched_at: Date.now(),
        }))

        dispatch(actions.softReset())
        dispatch(actions.fillUpsert(response.data.items[0]))

        return response.data
      }
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return rsc_catched_error(err, rejectWithValue)
  }
})

export const extraReducers = {

  // upsert
  [upsert.pending]: (state, action) => {
    state.loading = true
  },
  [upsert.rejected]: (state, action) => {
    state.loading = false
    show_under_form_fields(state.upsert, action.payload)
    console.error(action)
  },
  [upsert.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }

    state.upsert = {
      ...state.upsert,
      ...form.state,
    }

    if (_.hasIn(action.payload, "items")) {
      move_to_start(state, action.payload.items[0].uuid)
    }
  },

  // fetch_by_uuid
  [fetch_by_uuid.pending]: (state, action) => {
    state.loading = true
  },
  [fetch_by_uuid.rejected]: (state, action) => {
    state.loading = false
    console.error(action)
  },
  [fetch_by_uuid.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "total")) {
      state.rsc.total = action.payload.total
    }
  },

  // metadata
  [metadata.pending]: (state, action) => {
    state.loading = true
  },
  [metadata.rejected]: (state, action) => {
    state.loading = false
    console.error(action)
  },
  [metadata.fulfilled]: (state, action) => {
    state.loading = false

    if (_.hasIn(action.payload, "languages")) {
      state.languages = action.payload.languages
    }

    if (_.hasIn(action.payload, "timezones")) {
      state.timezones = action.payload.timezones
    }

    if (_.hasIn(action.payload, "localeIsoFormats")) {
      state.localeIsoFormats = action.payload.localeIsoFormats
    }
  },
}
