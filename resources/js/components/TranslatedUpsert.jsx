import {
  Box,
  Collapse,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip
} from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useDispatch, useSelector } from "react-redux"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import FormatLineSpacingIcon from "@material-ui/icons/FormatLineSpacing"
import React, { useState, Fragment } from "react"
import TranslateIcon from "@material-ui/icons/Translate"
import { useParams } from "react-router-dom"
import _ from "lodash"

import InteractiveButton from "Kwerio/components/InteractiveButton"
import RequireLanguages from "Kwerio/components/RequireLanguages"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"

const useStyles = makeStyles(theme => createStyles({
  paper: {
    padding: theme.spacing(2),
  },

  loadingPaper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
  },

  renderedItem: {
    border: `1px solid ${theme.palette.divider}`,
    borderTop: "none",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },

  actions: {
    marginTop: theme.spacing(2),
  },
}))

function TranslatedUpsert({
  render,                         // Render single item.
  reducer = "languages",          // Languages reducer name.
  actions,                        // Languages actions.
  adapter,                        // Languages adapter.
  services,                       // Languages services.
  endpoint,                       // Module endpoints.
  saveDisabled,                   // Callback to check if save button disabled.
  componentReducer,               // Component reducer name.
  componentActions,               // Component actions.
  componentServices,              // Component services.
  componentState,                 // Component state.
  componentAdapter,               // Component adapter.
  componentDidMount,              // Callback when component did mount.
}) {
  const request = useRequest({ reducer, services: services({ actions }) }),
    componentRequest = useRequest({ reducer: componentReducer, services: componentServices({ actions: componentActions }) }),
    selector = adapter.getSelectors(),
    state = useSelector(state => state.languages),
    t = useT(),
    classes = useStyles(),
    [show_native_name, setShowNativeName] = useState(false),
    [expand_all, setExpandAll] = useState(false),
    dispatch = useDispatch(),
    [collapsed, setCollapsed] = useState({}),
    params = useParams()

  let languages = selector.selectAll(state)

  // Seed data to UI.
  React.useEffect(() => {
    if (languages.length > 0) {
      let collapsed = {}

      for (let i = 0; i < languages.length; i ++) {
        let open = false

        if (languages[i].default_at !== null) {
          open = true
        }

        collapsed[languages[i].locale] = open
      }

      setCollapsed(collapsed)
      dispatch(componentActions.initUpsert(languages))

      // Fetch data by uuid (when updating)
      const uuid = _.get(params, "uuid")

      if (uuid) {
        componentRequest.fetch_by_uuid(uuid)
      }
    }

    return () => {
      dispatch(componentActions.resetUpsert())
    }
  }, [languages.length])

  /**
   * Toggle all collapsed states.
   */
  function _toggle_all_collapsed() {
    const expanded = !expand_all
    let collapsed = {}

    setExpandAll(expanded)

    for (let i = 0; i < languages.length; i ++) {
      collapsed[languages[i].locale] = expanded
    }

    setCollapsed(collapsed)
  }

  return (
    <RequireLanguages
      reducer={reducer}
      services={services}
      actions={actions}
      adapter={adapter}
      endpoint={endpoint}
      render={languages => (
        <Paper className={classes.paper}>
          <Box display="flex" alignItems="center">
            <Tooltip title={t(expand_all ? "Collapse all" : "Expand all")}>
              <IconButton onClick={() => _toggle_all_collapsed()}>
                <FormatLineSpacingIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t(show_native_name ? "Show language english name" : "Show language native name")}>
              <IconButton onClick={() => setShowNativeName(!show_native_name)}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider className={classes.divider} />

          <Box>
            <Box>
              {componentState.upsert.items.map((item, index) => (
                <Fragment key={item.language.uuid}>
                  <ListItem
                    selected={!collapsed[item.language.locale]}
                    divider
                    button
                    className={classes.listItem}
                    onClick={() => setCollapsed({ ...collapsed, [item.language.locale]: !collapsed[item.language.locale] })}
                  >
                    <ListItemIcon>{collapsed[item.language.locale] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
                    <ListItemText primary={show_native_name ? item.language.native_name : item.language.name} />
                  </ListItem>
                  <Collapse in={collapsed[item.language.locale]}>
                    <Box className={classes.renderedItem}>
                      {render(item, index)}
                    </Box>
                  </Collapse>
                </Fragment>
              ))}
            </Box>

            <Box className={classes.actions}>
              <InteractiveButton
                loading={componentState.loading}
                onClick={() => componentRequest.upsert()}
                disabled={saveDisabled && saveDisabled()}
              >
                {t("Save")}
              </InteractiveButton>
            </Box>
          </Box>
        </Paper>
      )}
    />
  )
}

export default React.memo(TranslatedUpsert)
