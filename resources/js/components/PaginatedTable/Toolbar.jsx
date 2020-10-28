import { Box, Button, Divider, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import React, { useState, useRef } from "react"

import useStyles from "./Toolbar.styles"
import useT from "../../hooks/useT"

let timer

function Toolbar({

  // Actions.
  actions,
  tableAsyncActions,

  // Search.
  hasSearch = true,
  searchLabel = null,
  onSearch = null,

  // Add button
  hasAddButton = true,
  buttonLabel = null,
  onAddButtonClick = () => {}
}) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory(),
    [q, setQ] = useState(""),
    q_ref = useRef(),
    translations = useSelector(state => state.app.t),
    t = useT(translations)

  if (searchLabel === null) searchLabel = t("Search")
  if (buttonLabel === null) buttonLabel = t("Create new")

  q_ref.current = q

  function handleChange(e) {
    if (onSearch !== null) {
      onSearch(e)
    } else {
      setQ(e.target.value)
      clearTimeout(timer)

      timer = setTimeout(() => {
        dispatch(actions.removeAll())
        dispatch(actions.setQ(q_ref.current))
        dispatch(tableAsyncActions.index())
      }, 1000)
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        px={1}
        pt={1}
        alignItems="flex-start"
      >
        <Box>
          {hasSearch && (
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
          <Button onClick={onAddButtonClick}>
            {buttonLabel}
          </Button>
        </Box>
      </Box>

      <Divider />
    </>
  )
}

export default React.memo(Toolbar)
