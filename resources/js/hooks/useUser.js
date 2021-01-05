import { useSelector } from "react-redux"

export default function() {
  const user = useSelector(state => state.app.user)

  return {
    can: (ability) => user.abilities.indexOf(ability) !== -1,
    canAny: (abilities) => {
      for (let i = 0; i < abilities.length; i ++) {
        if (user.abilities.indexOf(abilities[i]) !== -1) {
          return true
        }
      }
      return false
    }
  }
}
