import { actions as abilitiesActions } from "../Abilities/index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"
import * as upsert from "../../utils/request/upsert.js"
import fetch_by_uuid from "../../utils/request/fetch_by_uuid.js"

const services = ({ actions }) => ({
  upsert: () => ({
    url: args => upsert.url({ api: api.lordland.admission.users, ...args }),
    data: args => upsert.data(args),
    200: args => upsert.redirect_to_index({ actions, endpoint: endpoints.lordland.admission.users, ...args }),
  }),

  metadata: () => ({
    url: api.lordland.admission.users.metadata,
    200: ({ dispatch, data }) => {
      if ("groups" in data) {
        dispatch(groupsActions.upsertMany(data.groups.items))
        dispatch(groupsActions.updateRscTotal(data.groups.total))
      }

      if ("modules" in data) {
        dispatch(modulesActions.upsertMany(data.modules.items))
        dispatch(modulesActions.updateRscTotal(data.modules.total))
      }

      if ("abilities" in data) {
        dispatch(abilitiesActions.upsertMany(data.abilities.items))
        dispatch(abilitiesActions.updateRscTotal(data.abilities.total))
      }

      return data
    }
  }),

  fetch_by_uuid: args => fetch_by_uuid({ actions, api: api.lordland.admission.users, ...args }),
})

export default services
