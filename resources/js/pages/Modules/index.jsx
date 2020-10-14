import { useDispatch } from "react-redux"
import React from "react"

import { asyncActions } from "./index.slice"
import OneColumnPage from "../Page/OneColumnPage"
import useStyles from "./index.styles"

function Modules() {
  const classes = useStyles(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(asyncActions.index())
  }, [])

  return (
    <OneColumnPage>
      Modules
    </OneColumnPage>
  )
}

export default React.memo(Modules)
