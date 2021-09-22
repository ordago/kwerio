import { makeStyles, createStyles } from "@mui/styles"
import { red, blue } from "@mui/material/colors"

export default makeStyles(theme => createStyles({
  genericBtn: {
    marginLeft: theme.spacing(2),
  },

  // Create Button.
  createBtn: {
    backgroundColor: blue[500],

    "&:hover": {
      backgroundColor: blue[700],
    },
  },

  createBtnLabel: {
    color: blue[50],
  },

  createIconBtn: {
    color: blue[500],

    "&:hover": {
      color: blue[700],
    },
  },

  // Delete Button.
  deleteBtn: {
    backgroundColor: red[500],

    "&:hover": {
      backgroundColor: red[700],
    },
  },

  deleteBtnLabel: {
    color: red[50],
  },

  deleteIconBtn: {
    color: red[500],

    "&:hover": {
      color: red[700],
    },
  },
}))
