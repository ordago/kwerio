export default {
  fulfilled: (state, action) => {
      state.name = action.payload.module.name
      state.uid = action.payload.module.uid
      state.slug = action.payload.module.slug
  },
}
