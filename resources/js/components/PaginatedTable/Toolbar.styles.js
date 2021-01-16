import { makeStyles, createStyles } from '@material-ui/core/styles'
import { red } from "@material-ui/core/colors"

export default makeStyles(theme => createStyles({
  root: {

  },

  deleteBtn: {
    backgroundColor: red[500],
    marginRight: theme.spacing(2),

    "&:hover": {
      backgroundColor: red[700],
    },
  },

  deleteBtnTextPrimary: {
    color: red[500],

    "&:hover": {
      color: red[700],
    },
  },
}))
