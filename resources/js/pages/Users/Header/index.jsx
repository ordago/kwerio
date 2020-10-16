import { Box, Button } from "@material-ui/core"
import React from "react"
import { useHistory } from 'react-router-dom'

import { endpoints } from "../../../routes/app"
import BaseHeader from "../../Page/Header"
import useStyles from "./index.styles"

function Header({ title = "Users", LeftComponent = [], RightComponent = [] }) {
  const classes = useStyles(),
    history = useHistory()

  return (
    <BaseHeader title={title} className={classes.root}>
      <Box pl={2}>{LeftComponent}</Box>

      <Box className={classes.right} pr={2}>
        {RightComponent}
      </Box>
    </BaseHeader>
  )
}

export default React.memo(Header)
