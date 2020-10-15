import { Box, TextField } from "@material-ui/core"
import React, { useState, useRef } from "react"
import { useDispatch } from 'react-redux'

import useStyles from "./index.styles"

let timer

function Toolbar({ actions, tableAsyncActions }) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    [q, setQ] = useState(""),
    q_ref = useRef()

  q_ref.current = q

  function handleChange(e) {
    setQ(e.target.value)
    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch(actions.removeAll())
      dispatch(actions.setQ(q_ref.current))
      dispatch(tableAsyncActions.index())
    }, 1000)
  }

  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        <TextField
          label="Search"
          name="search"
          type="search"
          onChange={handleChange}
          value={q}
        />
      </Box>

      <Box>
        Right
      </Box>
    </Box>
  )
}

export default React.memo(Toolbar)
