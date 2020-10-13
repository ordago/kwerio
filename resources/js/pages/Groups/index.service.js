import { createAsyncThunk } from "@reduxjs/toolkit"

import axios from "axios"

import { api } from "../../routes/app"

export const PREFIX = 'groups'

export const fetch_metadata = createAsyncThunk(`${PREFIX}/fetch_metadata`, async () => {
  return (await axios.get(api.groups.metadata)).data
})

export const update_or_create = createAsyncThunk(`${PREFIX}/update_or_create`, async (__, { getState, rejectWithValue }) => {
  const data = getState().groups.update_or_create

  let endpoint = api.groups.update

  if (_.isNull(data.uuid)) {
    endpoint = api.groups.create
  }

  try {
    const response = await axios.post(endpoint, {
      uuid: data.uuid,
      name: data.name.value,
      modules: data.modules.value,
    })
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})
