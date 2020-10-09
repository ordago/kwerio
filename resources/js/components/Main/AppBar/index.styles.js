import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  root: {
    width: "100%",
  },

  logo: {
    height: 35,
  },

  menuIconBtn: {
    marginRight: theme.spacing(2),
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },

  toolbarLeft: {
    display: "flex",
    alignItems: "center",
  },

  toolbarRight: {
    display: "flex",
    alignItems: "center",
  },
}))
