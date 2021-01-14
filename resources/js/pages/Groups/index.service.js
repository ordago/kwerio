import { actions as abilitiesActions } from "../Abilities/index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as modulesActions } from "../Modules/index.slice"

export default ({ actions }) => ({
  metadata: () => ({
    url: api.groups.metadata,
    200: ({ dispatch, data }) => {
      if ("groups" in data) {
        dispatch(actions.upsertMany(data.groups.items))
        dispatch(actions.updateRscTotal(data.groups.total))
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
    url: api.groups.fetch_by_uuid,
    data: {
      uuid: params,
    },
    200: ({ dispatch, data }) => {
      dispatch(actions.upsertOne({ ...data.items[0] }))
      dispatch(actions.fillUpsert(data.items[0]))

      return data
    },
  }),

  upsert: () => ({
    url: ({ state }) => state.upsert.uuid ? api.groups.update : api.groups.create,
    data: ({ state }) => ({
      uuid: state.upsert.uuid,
      name: state.upsert.name.value,
      modules: state.upsert.modules.value,
      abilities: state.upsert.abilities.value,
    }),
    200: ({ dispatch, data, state, history }) => {
      const route_to_index = ! state.upsert.uuid

      dispatch(actions.upsertOne({ ...data.items[0], touched_at: Date.now() }))
      dispatch(actions.resetTableTrackers())
      dispatch(actions.fillUpsert(data.items[0]))

      if (route_to_index) {
        dispatch(actions.resetUpsert())
        history.push(endpoints.groups.index)
      }

      return data
    }
  })
})
