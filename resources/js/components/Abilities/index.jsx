import {
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { adapter } from "../../pages/Abilities/index.slice"
import useT from "../../hooks/useT"

// @see js/pages/Groups/Upsert/index.jsx for example usage.

function Abilities({
  parentAdapter,  // Adapter of the element that the abilities will be extracted from.
  actions,        // Actions of the element who's using Abilities component (contains abilities form).
  reducerName,    // Reducer of the element that contain abilities.
  items,          // List of items that contains normalized abilities.
  state,          // State of the element who has abilities form.
}) {
  const parentSelector = parentAdapter.getSelectors(),
    parentState = useSelector(state => state[reducerName]),
    parent_data = parentSelector.selectAll(parentState),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    myState = useSelector(state => state.abilities),
    selector = adapter.getSelectors(),
    dispatch = useDispatch()

  let parent_values = []

  if (parent_data.length > 0) {
    parent_values = items.value
      .map(id => parentSelector.selectById(parentState, id))
      .filter(Boolean)
  }

  let abilities = []

  for (let i = 0; i < parent_values.length; i ++) {
    let name = parent_values[i].name
    let content = []

    for (let j = 0; j < parent_values[i].abilities.length; j ++) {
      let ability = selector.selectById(myState, parent_values[i].abilities[j])

      if (!_.isUndefined(ability)) {
        content.push(selector.selectById(myState, parent_values[i].abilities[j]))
      }
    }

    if (content.length > 0) {
      abilities.push({ name, abilities: content })
    }
  }

  function _is_ability_checked(ability_uuid) {
    return state.upsert.abilities.value.filter(uuid => uuid === ability_uuid).length > 0
  }

  function _is_check_all_checked() {
    return abilities.map(ab => ab.abilities.map(item => item.uuid)).flat().length === state.upsert.abilities.value.length
  }

  return (
    <>
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
    </>
  )
}

export default React.memo(Abilities)
