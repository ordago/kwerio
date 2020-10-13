import { Box, Grid, Paper } from "@material-ui/core"
import React from "react"

function OneColumnPaper({ children, className = null }) {
  return (
    <Box m={2}>
      <Grid container justify="center">
        <Grid item>
          <Paper className={className}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OneColumnPaper
