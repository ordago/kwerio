import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  root: {
    height: config => config.page_header_height,
    backgroundColor: "white",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  title: {
    padding: `0 ${theme.spacing(5)}px`,
  },
}))
