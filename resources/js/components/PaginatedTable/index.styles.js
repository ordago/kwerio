import { makeStyles, createStyles } from "@mui/styles"
import { green } from "@mui/material/colors"

export default makeStyles(theme => createStyles({
  root: {

  },
  touchedAt: {
    backgroundColor: theme.palette.type === "dark" ? green[900] : green[50],
  },
}))
