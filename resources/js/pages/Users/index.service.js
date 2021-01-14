import { actions as abilitiesActions } from "../Abilities/index.slice"
import { api, endpoints } from "../../routes/index.jsx"
import { actions as groupsActions } from "../Groups/index.slice"
import { actions as modulesActions } from "../Modules/index.slice"

const services = ({ actions }) => ({
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

  fetch_by_uuid: ({ params }) => ({
    url: api.users.fetch_by_uuid,
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
    url: ({ state }) => state.upsert.uuid ? api.users.update : api.users.create,
    data: ({ state }) => ({
      uuid: state.upsert.uuid,
      email: state.upsert.email.value,
      first_name: state.upsert.first_name.value,
      last_name: state.upsert.last_name.value,
      locale: state.upsert.locale.value,
      timezone: state.upsert.timezone.value,
      locale_iso_format: state.upsert.locale_iso_format.value,
      password: state.upsert.password.value,
      password_confirmation: state.upsert.password_confirmation.value,
      groups: state.upsert.groups.value,
      abilities: state.upsert.abilities.value,
    }),
    200: ({ dispatch, data, history, state }) => {
      const route_to_index = ! state.upsert.uuid

      console.log(route_to_index)

      dispatch(actions.upsertOne({ ...data.items[0], touched_at: Date.now() }))
      dispatch(actions.resetTableTrackers())
      dispatch(actions.fillUpsert(data.items[0]))

      if (route_to_index) {
        history.push(endpoints.users.index)
      }

      return data
    },
  }),
})

export default services
