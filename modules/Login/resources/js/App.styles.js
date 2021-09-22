import { makeStyles, createStyles } from "@mui/styles"
import { green, blue } from "@mui/material/colors"

export default makeStyles(theme => ({
  root: {
    height: "100vh",
  },

  mb5rem: {
    marginBottom: "5rem",
  },

  email: {
    marginBottom: theme.spacing(2),
  },

  loginBtn: {
    width: "100%",
  },

  loginBtnSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },

  loginBtnWrapper: {
    marginBottom: theme.spacing(1),
    position: "relative",
  },

  loginBtnProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -12,
  },

  fab: {
    marginBottom: theme.spacing(1),
  },

  password: {
    marginBottom: theme.spacing(1),
  },

  rememberMe: {
    marginBottom: theme.spacing(1),
  },
}))
