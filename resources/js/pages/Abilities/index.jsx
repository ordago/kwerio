import { useDispatch } from "react-redux"
import React from "react"

import { asyncActions } from "./index.slice"
import OneColumnPage from "../../components/OneColumnPage"
import useStyles from "./index.styles"

function Abilities() {
  const classes = useStyles(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(asyncActions.index())
  }, [])

  return (
    <OneColumnPage>
      Abilities
    </OneColumnPage>
  )
}

export default React.memo(Abilities)
