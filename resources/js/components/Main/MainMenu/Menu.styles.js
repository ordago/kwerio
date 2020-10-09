import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  root: {

  },

  logo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    height: (settings) => settings.appbar_height,
  },

  pin: {
    transition: "transform .2s",
  },

  pinned: {
    transform: "rotate(-45deg)",
  },
}))
