import { createSlice } from "@reduxjs/toolkit"

const PREFIX = 'users'


const initialState = {
  columns: [
    { slug: "id", label: "Id" },
    { slug: "email", label: "Email", sort: true, sortDirection: "asc" },
    { slug: "first_name", label: "First name", sort: true, sortDirection: "asc" },
    { slug: "last_name", label: "Last name", sort: true, sortDirection: "asc" },
    { slug: "updated_at", label: "Updated at", sort: true, sortDirectory: "desc" },
    { slug: "created_at", label: "Created at", sort: true, sortDirection: "desc" },
  ]
}

const slice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
  },
  extraReducers: {
  },
})

export const actions = slice.actions

export default slice.reducer
