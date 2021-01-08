function _toggle_items(items, item) {
  for (let i = 0; i < items.length; i ++) {
    if (("open" in items[i]) && items[i].id === item.id) {
      items[i].open = !items[i].open
      break
    }

    if ("children" in items[i]) {
      _toggle_items(items[i].children, item)
    }
  }
}

export default {
  toggleMenu: (state, action) => {
    const { menu, item } = action.payload

    if (!("open" in item)) {
      return
    }

    let path = menu

    if (menu.includes(".")) {
      path = menu.split(".").slice(1).join(".")
    }

    _toggle_items(_.get(state, path), item)
  },
}
