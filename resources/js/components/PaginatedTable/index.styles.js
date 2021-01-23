import { makeStyles, createStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'

export default makeStyles(theme => createStyles({
  root: {

  },
  touchedAt: {
    backgroundColor: theme.palette.type === "dark" ? green[900] : green[50],
  },
}))
