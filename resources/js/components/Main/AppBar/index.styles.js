import { makeStyles, createStyles } from "@mui/styles"
import { grey, blue } from "@mui/material/colors"

export default makeStyles(theme => createStyles({
  root: {
    width: "100%",
    backgroundColor: theme.palette.type === "dark" ? grey[900] : blue[500],
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

  avatar: {
    width: theme.spacing(3.8),
    height: theme.spacing(3.8),
  },
}))
