export default {
  fulfilled: (state, action) => {
    state.menu = action.payload.menu
  },
  reducers: {
    toggleMenu: (state, action) => {
      const { menu, item } = action.payload

      if (!("open" in item)) {
        return
      }

      let path = menu

      if (menu.includes(".")) {
        path = menu.split(".").slice(1).join(".")
      }

      const items = _.get(state, path)

      for (let i = 0; i < items.length; i ++) {
        if (("open" in items[i]) && items[i].id === item.id) {
          items[i].open = !items[i].open
          break
        }

        if ("children" in items[i]) {
          _toggle_items(items[i].children, item)
        }
      }
    },
  },
  state: {
    menu: [],
  }
}
