import { useDispatch } from "react-redux"
import React from "react"

import { actions, asyncActions } from "./index.slice"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "KwerioComponents/PaginatedTable/index.jsx"
import useStyles from "./index.styles"

function Modules() {
  const classes = useStyles(),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(asyncActions.index())
  }, [])

  return (
    <OneColumnPage>
      <PaginatedTable
        reducer="modules"
        actions={actions}
        asyncActions={asyncActions}
      />
    </OneColumnPage>
  )
}

export default React.memo(Modules)
