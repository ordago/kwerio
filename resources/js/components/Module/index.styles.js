import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  root: {
    display: "flex",
    marginTop: config => config.appbar_height,
  },
}))
