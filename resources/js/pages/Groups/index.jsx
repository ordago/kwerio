import { useDispatch } from "react-redux"
import React from "react"

import { actions, asyncActions, fetch_metadata } from "./index.slice"
import OneColumnPaper from "../Page/OneColumnPaper"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useStyles from "./index.styles"

function Groups() {
  const classes = useStyles(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(asyncActions.index())
    dispatch(fetch_metadata())
  }, [])

  return (
    <OneColumnPaper>
      <PaginatedTable
        reducer="groups"
        actions={actions}
        asyncActions={asyncActions}
      />
    </OneColumnPaper>
  )
}

export default React.memo(Groups)
