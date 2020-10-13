import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"

import { combineReducers } from "redux"

import app from "./App.slice"

export default function(extraReducers) {
  const reducer = combineReducers({
    app,
    ...extraReducers,
  })

  return configureStore({
    reducer,
    devTools: true,
    middleware: [...getDefaultMiddleware()],
  })
}
