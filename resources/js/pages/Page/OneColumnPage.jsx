import { Box, Grid, IconButton, Paper } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import React from "react"
import { makeStyles, createStyles } from '@material-ui/core/styles'

function OneColumnPaper({ children, className = null, back_to = null }) {
  const history = useHistory(),
    classes = useStyles()

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
            <ArrowBackIcon fontSize="inherit" />
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

export default OneColumnPaper
