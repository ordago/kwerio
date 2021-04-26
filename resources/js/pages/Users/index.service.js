import { actions as abilitiesActions } from "../Abilities/index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"
import * as upsert from "../../utils/request/upsert.js"
import fetch_by_uuid from "../../utils/request/fetch_by_uuid.js"

const services = ({ actions }) => ({
  upsert: () => ({
    url: ({ state, primaryKey }) => upsert.url(api.users, { state, primaryKey }),
    data: ({ state }) => upsert.data(state),
    200: ({ dispatch, data, history, state }) => upsert.to_index(actions, endpoints.users, { dispatch, data, history, state }),
  }),

  metadata: () => ({
    url: api.users.metadata,
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

  fetch_by_uuid: ({ params }) => fetch_by_uuid(actions, api.users, params),
})

export default services
