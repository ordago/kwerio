import { makeStyles, createStyles } from '@material-ui/core/styles'

export default makeStyles(theme => createStyles({
  root: {
    marginTop: settings => settings.appbar_height,
  },
}))
