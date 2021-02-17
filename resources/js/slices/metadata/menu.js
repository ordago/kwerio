export default {
  fulfilled: (state, action) => {
    state.menu = action.payload.menu
  },
  reducers: {
    openParentOf: (state, action) => {
      const { menu, item } = action.payload,
        items = _get_menu_items(state, menu)

      let parent = {}

      loop1:
      for (let i = 0; i < items.length; i ++) {
        if ("children" in items[i]) {
          parent = items[i]

          for (let j = 0; j < items[i].children.length; i ++) {
            if (items[i].children[j].id === item.id) {
              parent.open = true
              break loop1
            }
          }
        }
      }
    },

    toggleMenu: (state, action) => {
      const { menu, item } = action.payload

      if (!("open" in item)) {
        return
      }

      const items = _get_menu_items(state, menu)

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

function _get_menu_items(state, menu) {
  let path = menu

  if (menu.includes(".")) {
    path = menu.split(".").slice(1).join(".")
  }

  return _.get(state, path)
}
