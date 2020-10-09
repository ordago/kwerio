import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"

import { combineReducers } from "redux"

import config from "./slices/config"
import mainMenu from "./components/Main/MainMenu/index.slice"
import theme from "./slices/theme"

export default function(extraReducers) {
  const reducer = combineReducers({
    config,
    mainMenu,
    theme,
    ...extraReducers,
  })

  return configureStore({
    reducer,
    devTools: true,
    middleware: [...getDefaultMiddleware()],
  })
}
