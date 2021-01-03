import { Autocomplete } from "@material-ui/lab"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField
} from "@material-ui/core"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes/app"
import { notify } from "../../../utils/errors"
import Abilities from "../../../components/Abilities/index.jsx"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Page from "../../../components/Page"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"
import { adapter as modulesAdapter } from '../../Modules/index.slice'

function Upsert({ match }) {
  const state = useSelector(state => state.groups),
    { name, modules } = state.upsert,
    classes = useStyles(),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    uuid = useUuid({ reducer: "groups", match, adapter, asyncActions, actions }),
    modulesState = useSelector(state => state.modules),
    modulesSelector = modulesAdapter.getSelectors(),
    modules_options = modulesSelector.selectAll(modulesState)

  React.useEffect(() => {
    dispatch(asyncActions.metadata()).then(action => notify(action, enqueueSnackbar))
  }, [])

  return (
    <Page
      title={t("Groups")}
      loading={state.loading}
      menu={() => <AccountMenu match={match} />}
      content={() => (
        <Card>
          <CardContent>
            <TextField
              name={name.name}
              label="Group name"
              fullWidth
              value={name.value}
              onChange={e => dispatch(actions.handleChange({ name: e.target.name, value: e.target.value }))}
              onBlur={e => dispatch(actions.handleBlur({ name: e.target.name, value: e.target.value }))}
              helperText={name.error ? name.helper_text : ""}
              error={name.error}
            />

            <Autocomplete
              multiple
              name={modules.name}
              value={modules.value.map(uid => modulesSelector.selectById(modulesState, uid)).filter(Boolean)}
              filterSelectedOptions
              options={modules_options}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option.uid === value.uid}
              onChange={(e, value, reason) => {
                dispatch(actions.handleChange({
                  name: modules.name,
                  value: value.map(module => module.uid)
                }))
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Modules"
                  margin="dense"
                />
              )}
            />

            <Abilities
              parentAdapter={modulesAdapter}
              actions={actions}
              state={state}
              reducerName="modules"
              items={modules}
            />

          </CardContent>

          <CardActions>
            <Button
              disabled={is_disabled({ name })}
              onClick={() => {
                dispatch(asyncActions.upsert())
                  .then(action => notify(action, enqueueSnackbar))
                  .then(action => {
                    if (!_.isUndefined(action)) {
                      enqueueSnackbar(`Success`, { variant: "success" })
                      history.push(endpoints.groups.index)
                    }
                  })
              }}
            >
              save
            </Button>
          </CardActions>
        </Card>
      )}
    />
  )
}

export default React.memo(Upsert)
