import { Box, Grid, IconButton, Paper } from "@mui/material"
import { makeStyles, createStyles } from "@mui/styles"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import React from "react"

function OneColumnPage({ children, className = null, back_to = null }) {
  const history = useHistory(),
    classes = useStyles(),
    { user } = useSelector(state => state.app)

  return (
    <Box m={2}>
      <Grid container justify="center">
        <Grid item>
          <IconButton
            onClick={() => {
              if (back_to !== null) {
                history.push(back_to)
              } else {
                history.goBack()
              }
            }}
            aria-label="back"
            className={classes.backIconBtn}
            size="medium"
          >
            {user.is_rtl && <ArrowForwardIcon fontSize="inherit" />}
            {!user.is_rtl && <ArrowBackIcon fontSize="inherit" />}
          </IconButton>

          <Paper className={className}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

const useStyles = makeStyles(theme => createStyles({
  backIconBtn: {
    marginBottom: theme.spacing(1),
  }
}))

export default OneColumnPage
