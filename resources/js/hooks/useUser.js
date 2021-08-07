import { useSelector } from "react-redux"

export default function() {
  const user = useSelector(state => state.app.user),
    moduleState = useSelector(state => state.module)

  /**
   * Check if user is the owner.
   */
  function is_owner() {
    return !!user.owner_at
  }

  /**
   * Check if user belongs to a group.
   */
  function belongs_to_group(group) {
    for (let i = 0; i < user.groups_meta.length; i ++) {
      if (user.groups_meta[i].slug === group) {
        return true
      }
    }

    return false
  }

  /**
   * Check if user is root.
   */
  function is_root() {
    return belongs_to_group("root")
  }

  /**
   * Check if user have the given ability.
   */
  function can(ability) {
    if (user.owner_at !== null) {
      return true
    }

    if (typeof moduleState !== "undefined") {
      ability = `${moduleState.uid}/${ability}`
    }

    return user.abilities.indexOf(ability) !== -1
  }

  /**
   * Check if user has any of the given abilities.
   */
  function can_any(abilities) {
    for (let i = 0; i < abilities.length; i ++) {
      if (can(abilities[i])) {
        return true
      }
    }

    return false
  }

  return {
    belongs_to_group,
    is_owner,
    is_root,
    can,
    cant: ability => ! can(ability),
    can_any,
  }
}
