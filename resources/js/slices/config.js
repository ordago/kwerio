import { createSlice } from "@reduxjs/toolkit"

const NAME = "config"

const initialState = {
  settings: {
    main_menu_width: 292,
    menu_width: 254,
    appbar_height: 48,
  }
}

const config = createSlice({
  name: "config",
  initialState,
  reducers: {

  },
})

export default config.reducer
