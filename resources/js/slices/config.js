import { createSlice } from "@reduxjs/toolkit"

const NAME = "config"

const initialState = {
  settings: {
    main_menu_width: 292,
    menu_width: 254,
    appbar_height: 48,
    page_header_height: 40,
  }
}

const config = createSlice({
  name: "config",
  initialState,
  reducers: {

  },
})

export default config.reducer
