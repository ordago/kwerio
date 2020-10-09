import { makeStyles, createStyles } from "@material-ui/core/styles"

export default makeStyles(theme => createStyles({
  drawer: {
    width: (settings) => settings.main_menu_width,
    flexShrink: 0,
  },

  drawerPaper: {
    width: (settings) => settings.main_menu_width,
  },

  nestedListItem: {
    paddingLeft: theme.spacing(4),
  },
}))
