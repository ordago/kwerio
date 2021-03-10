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
import React from "react"

import { actions, adapter } from "../index.slice"
import { actions as appActions } from "../../../App.slice"
import { adapter as modulesAdapter } from "../../Modules/index.slice"
import Abilities from "../../../components/Abilities/index.jsx"
import Page from "../../../components/Page"
import services from "../index.service"
import useRequest from "../../../hooks/useRequest"
import useStyles from "./index.styles"
import useT from "../../../hooks/useT"
import useUser from "../../../hooks/useUser"
import useUuid from "../../../hooks/useUuid"

function Upsert({ match }) {
  const state = useSelector(state => state.groups),
    { name, modules } = state.upsert,
    classes = useStyles(),
    dispatch = useDispatch(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    request = useRequest({ reducer: "groups", services: services({ actions }) }),
    uuid = useUuid({ reducer: "groups", match, adapter, request, actions }),
    modulesState = useSelector(state => state.modules),
    modulesSelector = modulesAdapter.getSelectors(),
    modules_options = modulesSelector.selectAll(modulesState),
    user = useUser()

  React.useEffect(() => { request.metadata() }, [])

  let ability = "root/group_create"

  if (!_.isEmpty(uuid)) {
    ability = "root/group_update"
  }

  return (
    <Page
      title={t("Groups")}
      loading={state.loading}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      content={() => (
        <>
          {user.can(ability) && (
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
                  value={modules.value.map(uuid => modulesSelector.selectById(modulesState, uuid)).filter(Boolean)}
                  filterSelectedOptions
                  options={modules_options}
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => option.uuid === value.uuid}
                  onChange={(e, value, reason) => {
                    dispatch(actions.handleChange({
                      name: modules.name,
                      value: value.map(module => module.uuid)
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
                  onClick={() => { request.upsert() }}
                >
                  save
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}
    />
  )
}

export default React.memo(Upsert)
