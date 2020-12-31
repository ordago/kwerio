import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography
} from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { adapter as abilityAdapter } from "../../Abilities/index.slice"
import { adapter as groupsAdapter } from "../../Groups/index.slice"
import useT from "../../../hooks/useT"
import { actions } from '../index.slice'

function Abilities() {
  const state = useSelector(state => state.users),
    groupsState = useSelector(state => state.groups),
    abilitiesState = useSelector(state => state.abilities),
    { groups } = state.upsert,
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    dispatch = useDispatch(),
    groupsSelector = groupsAdapter.getSelectors(),
    abilitiesSelector = abilityAdapter.getSelectors()

  let abilities = []

  for (let i = 0; i < groups.value.length; i ++) {
    let group = groupsSelector.selectById(groupsState, groups.value[i])
    let inner = []

    if (_.isUndefined(group)) continue

    for (let j = 0; j < group.abilities.length; j ++) {
      let item = abilitiesSelector.selectById(abilitiesState, group.abilities[j])
      if (_.isUndefined(item)) continue
      inner.push(item)
    }

    if (inner.length > 0) {
      abilities.push({
        group_name: group.name,
        abilities: inner,
      })
    }
  }

  function _is_ability_checked(ability_uuid) {
    return state.upsert.abilities.value.filter(uuid => uuid === ability_uuid).length > 0
  }

  return (
    <Box>
      {abilities.length > 0 && (
        <>
          <Divider />
          <Typography variant="h5">{t("Abilities")}</Typography>

          {abilities.map(item => (
            <React.Fragment key={item.group_name}>
              {item.abilities.length > 0 && (
                <Typography variant="h6">{item.group_name}</Typography>
              )}

              <Grid container>
                {item.abilities.map(ability => (
                  <Grid key={ability.uuid} item xs={12}>
                    <FormControlLabel
                      label={ability.name}
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
    </Box>
  )
}

export default React.memo(Abilities)
