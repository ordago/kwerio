import { useDispatch } from "react-redux"
import React from "react"

import { asyncActions } from "./index.slice"
import OneColumnPage from "../Page/OneColumnPage"
import useStyles from "./index.styles"

function Users() {
  const classes = useStyles(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(asyncActions.index())
  }, [])

  return (
    <OneColumnPage>
      Users
    </OneColumnPage>
  )
}

export default React.memo(Users)
