import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { actions as abilitiesActions } from "../Abilities/index.slice"
import { actions } from "./index.slice"
import { api } from "../../routes"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"
import { reject_with_error } from "../../utils/errors"

export const PREFIX = "API_USERS"

export const metadata = createAsyncThunk(`${PREFIX}/metadata`, async (uuid, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState().apiUsers

    const response = await axios.post(api.apiUsers.metadata)

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

  catch (err) {
    return reject_with_error(err, rejectWithValue)
  }
})

export const fetch_by_uuid = createAsyncThunk(`${PREFIX}/fetch-by-uuid`, async (uuid, { dispatch, getState, rejectWithValue }) => {
  try {
    const response = await axios.post(api.apiUsers.fetch_by_uuid, { uuid })

    if (response.status === 200) {
      dispatch(actions.upsertOne({ ...response.data.items[0] }))
      dispatch(actions.fillUpsert(response.data.items[0]))
      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return reject_with_error(err, rejectWithValue)
  }
})

export const upsert = createAsyncThunk(`${PREFIX}/upsert`, async (token_unhashed, { dispatch, getState, rejectWithValue }) => {
  try {
    const {
      uuid,
      name,
      is_hashed,
      expires_at,
      groups,
      abilities,
    } = getState()["apiUsers"].upsert

    let endpoint = api.apiUsers.update

    if (!uuid) {
      endpoint = api.apiUsers.create
    }

    const response = await axios.post(endpoint, {
      uuid,
      name: name.value,
      is_hashed: is_hashed.value,
      expires_at: expires_at.value,
      token_unhashed,
      groups: groups.value,
      abilities: abilities.value,
    })

    if (response.status === 200) {
      dispatch(actions.upsertOne({
        ...response.data.items[0],
        touched_at: Date.now(),
      }))

      dispatch(actions.fillUpsert(response.data.items[0]))

      return response.data
    }

    return rejectWithValue(response.data)
  }

  catch (err) {
    return reject_with_error(err, rejectWithValue)
  }
})
