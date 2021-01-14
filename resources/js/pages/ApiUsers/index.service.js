import { actions as abilitiesActions } from "../Abilities/index.slice"
import { api } from "../../routes/index.jsx"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"

export default ({ actions }) => ({
  metadata: () => ({
    url: api.apiUsers.metadata,
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

  fetch_by_uuid: ({ params }) => ({
    url: api.apiUsers.fetch_by_uuid,
    data: {
      uuid: params,
    },
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertOne({ ...data.items[0] }))
      dispatch(actions.fillUpsert(data.items[0]))

      return data
    }
  }),

  upsert: ({ params }) => ({
    url: ({ state }) => state.upsert.uuid ? api.apiUsers.update : api.apiUsers.create,
    data: ({ state }) => ({
      uuid: state.upsert.uuid,
      name: state.upsert.name.value,
      is_hashed: state.upsert.is_hashed.value,
      expires_at: state.upsert.expires_at.value,
      token_unhashed: params,
      groups: state.upsert.groups.value,
      abilities: state.upsert.abilities.value,
    }),
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertOne({ ...data.items[0], touched_at: Date.now() }))
      dispatch(actions.resetTableTrackers())
      dispatch(actions.fillUpsert(data.items[0]))

      return data
    },
  }),
})
