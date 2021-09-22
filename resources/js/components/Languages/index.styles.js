import { makeStyles, createStyles } from "@mui/styles"
import { blue } from "@mui/material/colors"

export default makeStyles(theme => createStyles({
  setAsDefaultBtn: {
    marginRight: theme.spacing(2),
  },
  defaultLanguage: {
    backgroundColor: theme.palette.type === "dark" ? blue[900] : blue[50],
  },
}))
