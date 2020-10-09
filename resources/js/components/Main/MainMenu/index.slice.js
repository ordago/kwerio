import { createSlice } from "@reduxjs/toolkit"

import _ from "lodash"

const initialState = {
  open: false,
  data: [
    {
      id: 1,
      text: "applications",
      children: [{
        id: 2,
        text: "CMS",
        icon: "web",
        link: "#",
      }, {
        id: 3,
        text: "PIM",
        icon: "art_track",
        link: "/module/pim",
      }],
    },
    {
      id: 4,
      text: "account",
      children: [{
        id: 5,
        text: "Permissions",
        icon: "lock",
        link: "#",
        children: [{
          id: 6,
          text: "Groups",
          link: "#",
        }, {
          id: 7,
          text: "Users",
          link: "#",
        }]
      }, {
        id: 20,
        text: "Settings",
        icon: "settings",
        link: "#",
        children: [{
          id: 21,
          text: "Services",
          link: "#",
        }, {
          id: 22,
          text: "Styling",
          link: "#",
        }, {
          id: 23,
          text: "Account",
          link: "#",
        }]
      }, {
        id: 30,
        text: "Billing",
        icon: "money",
        link: "#",
      }]
    }
  ]
}

const mainMenu = createSlice({
  name: "main_menu",
  initialState,
  reducers: {
    setData: (state, action) => { state.data = action.payload },
    toggle: (state) => { state.open = !state.open },
    expand: (state, action) => {
      for (let i = 0; i < state.data.length; i ++) {
        for (let j = 0; j < state.data[i].children.length; j ++) {
          let item = state.data[i].children[j]
          if (item.id === action.payload) {
            item.open = !item.open
            return
          }

          if (_.hasIn(item, "children")) {
            for (let k = 0; k < item.children.length; k ++) {
              let sub_item = item.children[k]
              if (sub_item.id === action.payload) {
                sub_item.open = !sub_item.open
                return
              }
            }
          }
        }
      }
    },
  },
})

export const {
  setData,
  toggle,
  expand,
} = mainMenu.actions

export default mainMenu.reducer
