import { Box, CircularProgress } from "@material-ui/core"
import { useSelector } from "react-redux"
import React from "react"

import { adapter, tableAsyncActions, actions } from "./index.slice"
import Header from "./Header"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "../../components/PaginatedTable"

function Groups() {
  const state = useSelector(state => state.groups)

  return (
    <Box>
      <Header
        RightComponent={<HeaderRight loading={state.loading} />}
      />

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

function HeaderRight({ loading }) {
  return (
    <Box>
      {loading === "pending" && (
        <CircularProgress size={20} />
      )}
    </Box>
  )
}

export default React.memo(Groups)
