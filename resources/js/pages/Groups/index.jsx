import { Box } from "@material-ui/core"
import React from "react"

import { adapter, tableAsyncActions, actions } from "./index.slice"
import Header from "./Header"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "../../components/PaginatedTable"

function Groups() {
  return (
    <Box>
      <Header RightComponent={<HeaderRight />} />

      <OneColumnPage>
        <PaginatedTable
          actions={actions}
          adapter={adapter}
          reducerName="groups"
          asyncActions={tableAsyncActions}
        />
      </OneColumnPage>
    </Box>
  )
}

function HeaderRight() {
  return (
    <Box>
      Status
    </Box>
  )
}

export default React.memo(Groups)
