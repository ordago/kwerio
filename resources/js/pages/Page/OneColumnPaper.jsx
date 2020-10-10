import { Box, Grid, Paper } from "@material-ui/core"
import React from "react"

function OneColumnPaper({ children }) {
  return (
    <Box m={2}>
      <Grid container justify="center">
        <Grid item>
          <Paper>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OneColumnPaper
