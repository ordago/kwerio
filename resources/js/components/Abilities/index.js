export default {
  reducers: {
    toggleAllAbilities: (state, action) => {
      if (action.payload.checked === true) {
        state.upsert.abilities.value = action.payload.abilities
          .map(item => item.abilities.map(ability => ability.uuid))
          .flat()
      } else {
        state.upsert.abilities.value = []
      }
    },
    toggleAbility: (state, action) => {
      const idx = state.upsert.abilities.value.indexOf(action.payload)

      if (idx === -1) {
        state.upsert.abilities.value.push(action.payload)
      } else {
        state.upsert.abilities.value = state.upsert.abilities.value.filter(uuid => uuid !== action.payload)
      }
    },
  },

  form: {
    abilities: {
      validator: {
        required: false,
      },
      value: [],
    },
  },
}
