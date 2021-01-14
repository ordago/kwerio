import { Box, Button, Divider, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import React, { useState, useRef } from "react"

import { init_services } from "./"
import useRequest from "../../hooks/useRequest"
import useStyles from "./Toolbar.styles"
import useT from "../../hooks/useT"

let timer

function Toolbar({
  // Actions.
  actions,
  api,
  endpoint,
  request,
  reducer = "module",

  // Labels
  searchLabel = null,
  createButtonLabel = null,

  // Abilities
  canSearch = false,
  canCreate = false,
}) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory(),
    [q, setQ] = useState(""),
    q_ref = useRef(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  if (searchLabel === null) searchLabel = t("Search")
  if (createButtonLabel === null) createButtonLabel = t("Create new")

  q_ref.current = q

  function handleChange(e) {
    setQ(e.target.value)
    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch(actions.removeAll())
      dispatch(actions.setQ(q_ref.current))
      request.index()
    }, 1000)
  }

  return (
    <>
      {(canSearch || canCreate) && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            px={1}
            pt={1}
            alignItems="flex-start"
          >
            <Box>
              {canSearch && (
                <TextField
                  label={searchLabel}
                  name="search"
                  type="search"
                  onChange={handleChange}
                  value={q}
                />
              )}
            </Box>

            <Box>
              {canCreate && (
                <Button onClick={() => history.push(endpoint.create)}>
                  {createButtonLabel}
                </Button>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}
    </>
  )
}

export default React.memo(Toolbar)
