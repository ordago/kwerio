import { Autocomplete } from "@material-ui/lab"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography
} from "@material-ui/core"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import { adapter as abilitiesAdapter } from "../../Abilities/index.slice"
import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes/app"
import { adapter as modulesAdapter } from "../../Modules/index.slice"
import { notify } from "../../../utils/errors"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Page from "../../../components/Page"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"

function Upsert({ match }) {
  const state = useSelector(state => state.groups),
    { name, modules } = state.upsert,
    classes = useStyles(),
    modulesSelector = modulesAdapter.getSelectors(),
    modulesState = useSelector(state => state.modules),
    dispatch = useDispatch(),
    { enqueueSnackbar } = useSnackbar(),
    history = useHistory(),
    selector = adapter.getSelectors(),
    modules_data = modulesSelector.selectAll(modulesState),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    uuid = useUuid({ reducer: "groups", match, adapter, asyncActions, actions }),
    abilitiesState = useSelector(state => state.abilities),
    abilitiesSelector = abilitiesAdapter.getSelectors()

  let modules_value = []

  if (modules_data.length > 0) {
    modules_value = modules.value
      .map(uid => modulesSelector.selectById(modulesState, uid))
      .filter(Boolean)
  }

  let abilities = []

  if (modules_value.length > 0) {
    for (let i = 0; i < modules_value.length; i ++) {
      let name = modules_value[i].name
      let content = []

      for (let j = 0; j < modules_value[i].abilities.length; j ++) {
        let ability = abilitiesSelector.selectById(abilitiesState, modules_value[i].abilities[j])

        if (!_.isUndefined(ability)) {
          content.push(abilitiesSelector.selectById(abilitiesState, modules_value[i].abilities[j]))
        }
      }

      if (content.length > 0) {
        abilities.push({ name, abilities: content })
      }
    }
  }

  React.useEffect(() => {
    dispatch(asyncActions.metadata()).then(action => notify(action, enqueueSnackbar))
  }, [])

  function _is_ability_checked(ability_uuid) {
    return state.upsert.abilities.value.filter(uuid => uuid === ability_uuid).length > 0
  }

  function _is_check_all_checked() {
    return abilities.map(ab => ab.abilities.map(item => item.uuid)).flat().length === state.upsert.abilities.value.length
  }

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
              value={modules_value}
              filterSelectedOptions
              options={modules_data}
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

            {abilities.length > 0 && (
              <>
                <Divider />

                <Typography variant="h5">{t("Abilities")}</Typography>

                <FormControlLabel
                  label={t("Check all abilities")}
                  control={
                    <Switch
                      checked={_is_check_all_checked()}
                      onChange={e => dispatch(actions.toggleAllAbilities({
                        abilities,
                        checked: e.target.checked,
                      }))}
                    />
                  }
                />

                {abilities.map(item => (
                  <React.Fragment key={item.name}>
                    <Typography variant="h6">{item.name}</Typography>

                    <Grid container>
                      {item.abilities.map(ability => (
                        <Grid item xs={12} key={ability.uuid}>
                          <FormControlLabel
                            label={t(ability.description)}
                            control={
                              <Switch
                                onChange={() => dispatch(actions.toggleAbility(ability.uuid))}
                                checked={_is_ability_checked(ability.uuid)}
                              />
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </React.Fragment>
                ))}
              </>
            )}

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
