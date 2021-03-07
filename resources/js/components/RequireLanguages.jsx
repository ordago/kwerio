import { Alert } from "@material-ui/lab"
import { CircularProgress, Paper } from "@material-ui/core"
import { Link } from "react-router-dom"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import React from "react"

import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"

const useStyles = makeStyles(theme => createStyles({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}))

function RequireLanguages({
  render,
  reducer = "languages",
  services,
  actions,
  adapter,
  endpoint,
}) {
  const request = useRequest({ reducer: "languages", services: services({ actions }) }),
    selector = adapter.getSelectors(),
    state = useSelector(state => state.languages),
    t = useT(),
    classes = useStyles()

  let languages = selector.selectAll(state)

  languages.sort((a, b) =>
    (a.default_at === null) - (b.default === null)
    || +(a.default_at > b.default_at)
    || +(a.default_at < b.default_at)
  )

  React.useEffect(() => {
    if (!languages.length) {
      request.metadata({ only_models: true })
    }
  }, [])

  return (
    <>
      {state.loaded && languages.length === 0 && (
        <Alert severity="warning">
          {t("Please start by setting a default language.")}
          <Link to={endpoint.index}>{t("Languages")}</Link>
        </Alert>
      )}
      {state.loaded && languages.length > 0 && render(languages)}
      {!state.loaded && (
        <Paper className={classes.paper}>
          <CircularProgress />
        </Paper>
      )}
    </>
  )
}

export default React.memo(RequireLanguages)
