import { useSelector } from "react-redux"

export default function() {
  const user = useSelector(state => state.app.user),
    module = useSelector(state => state.module)

  function _can(ability) {
    if (user.owner_at !== null) {
      return true
    }

    if (typeof module !== "undefined") {
      ability = `${module.uid}/${ability}`
    }

    return user.abilities.indexOf(ability) !== -1
  }

  return {
    can: (ability) => _can(ability),
    canAny: (abilities) => {
      for (let i = 0; i < abilities.length; i ++) {
        if (_can(abilities[i])) {
          return true
        }
      }

      return false
    }
  }
}
