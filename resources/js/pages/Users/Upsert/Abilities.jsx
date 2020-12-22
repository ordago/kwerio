import { Box, FormControlLabel, Switch } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { actions } from "../index.slice"
import useT from "../../../hooks/useT"

function Abilities() {
  const state = useSelector(state => state.users),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch()

  return (
    <Box>
      Abilities
    </Box>
  )
}

export default React.memo(Abilities)
