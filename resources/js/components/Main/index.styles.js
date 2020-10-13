import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  box: {
    marginTop: config => config.appbar_height,
  },
}))
