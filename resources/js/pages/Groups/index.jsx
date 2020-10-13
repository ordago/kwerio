import { Box, Button } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import React from "react"

import { actions, asyncActions, fetch_metadata } from "./index.slice"
import { endpoints } from "../../routes/app"
import Header from "./Header"
import OneColumnPage from "../Page/OneColumnPage"
import PaginatedTable from "../../components/PaginatedTable/index.jsx"
import useStyles from "./index.styles"

function Groups() {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory()

  React.useEffect(() => {
    dispatch(asyncActions.index())
    dispatch(fetch_metadata())
  }, [])

  return (
    <Box>
      <Header
        right={() => (
          <Button
            variant="text"
            onClick={() => history.push(endpoints.account.permissions.groups.create)}
          >
            create new
          </Button>
        )}
      />

      <OneColumnPage>
        <PaginatedTable
          reducer="groups"
          actions={actions}
          asyncActions={asyncActions}
        />
      </OneColumnPage>
    </Box>
  )
}

export default React.memo(Groups)
