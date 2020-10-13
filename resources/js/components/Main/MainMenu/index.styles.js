import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  drawer: {
    width: (config) => config.main_menu_width,
    flexShrink: 0,
  },

  drawerPaper: {
    width: (config) => config.main_menu_width,
  },

  nestedListItem: {
    paddingLeft: theme.spacing(4),
  },
}))
