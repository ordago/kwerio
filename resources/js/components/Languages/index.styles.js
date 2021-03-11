import { makeStyles, createStyles } from "@material-ui/core/styles"
import { blue } from "@material-ui/core/colors"

export default makeStyles(theme => createStyles({
  setAsDefaultBtn: {
    marginRight: theme.spacing(2),
  },
  defaultLanguage: {
    backgroundColor: theme.palette.type === "dark" ? blue[900] : blue[50],
  },
}))
