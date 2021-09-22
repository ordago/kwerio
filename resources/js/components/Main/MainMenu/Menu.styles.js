import { makeStyles, createStyles } from "@mui/styles"

export default makeStyles(theme => createStyles({
  root: {

  },

  logo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    height: (config) => config.appbar_height,
  },

  pin: {
    transition: "transform .2s",
  },

  pinned: {
    transform: "rotate(-45deg)",
  },
}))
