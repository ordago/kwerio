import { Box } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import React from "react"

function PageHeader({ left = () => {}, right = () => {} }) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>{left()}</Box>
      <Box>{right()}</Box>
    </Box>
  )
}

const useStyles = makeStyles(theme => createStyles({
  root: {

  }
}))

export default React.memo(PageHeader)
