import { useSelector } from "react-redux"

export default function() {
  const user = useSelector(state => state.app.user),
    moduleState = useSelector(state => state.module)

  function _can(ability) {
    if (user.owner_at !== null) {
      return true
    }

    if (typeof moduleState !== "undefined") {
      ability = `${moduleState.uid}/${ability}`
    }

    return user.abilities.indexOf(ability) !== -1
  }

  return {
    can: ability => _can(ability),
    cant: ability => ! _can(ability),
    canAny: abilities => {
      for (let i = 0; i < abilities.length; i ++) {
        if (_can(abilities[i])) {
          return true
        }
      }

      return false
    }
  }
}
