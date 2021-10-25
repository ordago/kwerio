import { makeStyles, createStyles } from "@mui/styles"
import { blue } from "@mui/material/colors"

export default makeStyles(theme => createStyles({
  setAsDefaultBtn: {
    marginRight: theme.spacing(2),
  },
  defaultLanguage: {
    backgroundColor: blue[50],
  },
}))
