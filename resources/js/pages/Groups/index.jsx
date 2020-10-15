import { Box, CircularProgress } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import React from "react"

import { adapter, tableAsyncActions, actions } from "./index.slice"
import { endpoints } from "../../routes/app"
import Header from "./Header"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import Toolbar from "./Toolbar"

function Groups() {
  const state = useSelector(state => state.groups),
    history = useHistory()

  return (
    <Box>
      <Header
        RightComponent={<HeaderRight loading={state.loading} />}
      />

      <OneColumnPage>
        <Toolbar
          actions={actions}
          tableAsyncActions={tableAsyncActions}
        />

        <PaginatedTable
          actions={actions}
          adapter={adapter}
          reducerName="groups"
          asyncActions={tableAsyncActions}
          onRowClick={item => history.push(endpoints.groups.update.replace(/:uuid/, item.uuid))}
        />
      </OneColumnPage>
    </Box>
  )
}

function HeaderRight({ loading }) {
  return (
    <Box>
      {loading && (
        <CircularProgress size={20} />
      )}
    </Box>
  )
}

export default React.memo(Groups)
