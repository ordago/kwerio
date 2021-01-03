import abilities from "../Abilities/index"

export default {
  reducers: {
    ...abilities.reducers,
  },

  form: {
    ...abilities.form,
    groups: {
      value: [],
      validator: {
        required: false,
      },
    },
  }
}
