import { Box, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import FilterListIcon from "@material-ui/icons/FilterList"
import PauseIcon from "@material-ui/icons/Pause"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import React, { useState, useRef } from "react"
import clsx from "clsx"

import _ from "lodash"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"
import useUser from "Kwerio/hooks/useUser"

import { requestTemplate } from "../utils"
import GenericButton from "./GenericButton"
import services from "./index.service"
import useStyles from "./index.styles"

let timer

function Toolbar({
  // Table
  actions,
  api,
  endpoint,
  reducer,
  checkedItems,
  onQuery,
  primaryKey,

  // User
  useIcons = true,
  iconSize = "medium",

  abilitiesPrefix = null,
  abilities = {},
  abilitiesFn = {},

  beforeHooksFn = {},
  afterHooksFn = {},

  requests = {},
}) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory(),
    state = useSelector(state => state[reducer]),
    [q, setQ] = useState(state.q),
    q_ref = useRef(),
    t = useT(),
    request = useRequest({ reducer, services: services({ actions, api, endpoint, primaryKey }) }),
    user = useUser()

  q_ref.current = q

  const defaultAbilities = {
    create: false,
    delete: false,
    disable: false,
    duplicate: false,
    enable: false,
    filter: false,
    index: false,
  }

  let defaultAbilitiesFn = {},
    defaultAfterHooksFn = {},
    defaultBeforeHooksFn = {},
    defaultRequests = {}

  for (let action in defaultAbilities) {
    defaultAbilitiesFn[action] = checkedItems => true
    defaultAfterHooksFn[action] = () => {}
    defaultBeforeHooksFn[action] = () => {}
    defaultRequests[action] = requestTemplate

    if (action === "delete") {
      defaultRequests[action].method = "delete"
    }
  }

  if (abilitiesPrefix) {
    for (let ability in defaultAbilities) {
      if (!(ability in abilities)) {
        abilities[ability] = user.can(`${abilitiesPrefix}${ability}`)
      }
    }
  }

  abilities = _.merge(defaultAbilities, abilities)
  abilitiesFn = _.merge(defaultAbilitiesFn, abilitiesFn)
  afterHooksFn = _.merge(defaultAfterHooksFn, afterHooksFn)
  beforeHooksFn = _.merge(defaultBeforeHooksFn, beforeHooksFn)
  requests = _.merge(defaultRequests, requests)

  function handleChange(e) {
    setQ(e.target.value)
    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch(actions.removeAll())
      dispatch(actions.setQ(q_ref.current))
      onQuery()
    }, 1000)
  }

  const generic_button_props = action => ({
    action,
    useIcons,
    iconSize,
    onBefore: beforeHooksFn[action],
    onAfter: afterHooksFn[action],
    checkedItems,
    className: clsx(classes.genericBtn, classes[`${action}Btn`]),
    iconClassName: clsx(classes[`${action}IconBtn`]),
    request,
    requests,
    api,
    endpoint,
    classes: {
      label: classes[`${action}BtnLabel`],
    },
  })

  const generic_button_icon_props = {
    fontSize: iconSize === "medium" ? "default" : iconSize
  }

  function _is_allowed(action, require_checked_items_length = true) {
    if (require_checked_items_length && checkedItems.length === 0) return false
    if (abilities[action] === false) return false
    if (abilitiesFn[action](checkedItems) === false) return false

    return true
  }

  return (
    <>
      {Object.keys(abilities).filter(ability => abilities[ability] === true).length > 0 && (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            px={1}
            pt={1}
            alignItems="flex-start"
          >
            <Box>
              {abilities.index && ( <TextField
                label={t("Search")}
                name="search"
                type="search"
                onChange={handleChange}
                value={q}
              />)}
            </Box>

            <Box>
              {_is_allowed("duplicate") && <GenericButton
                icon={<FileCopyIcon { ...generic_button_icon_props }/>}
                title={t("Duplicate")}
                { ...generic_button_props("duplicate") }
              /> }

              {_is_allowed("delete") && <GenericButton
                icon={<DeleteForeverIcon { ...generic_button_icon_props } />}
                title={t("Delete Forever")}
                { ...generic_button_props("delete") }
              /> }

              {_is_allowed("disable") && <GenericButton
                icon={<PauseIcon { ...generic_button_icon_props } />}
                title={t("Disable")}
                { ...generic_button_props("disable") }
              /> }

              {_is_allowed("enable") && <GenericButton
                icon={<PlayArrowIcon { ...generic_button_icon_props } />}
                title={t("Enable")}
                { ...generic_button_props("enable") }
              /> }

              {abilities.filter && abilitiesFn.filter() && <GenericButton
                icon={<FilterListIcon { ...generic_button_icon_props } />}
                title={t("Filter")}
                { ...generic_button_props("filter") }
              /> }

              {abilities.create && abilitiesFn.create() && <GenericButton
                icon={<AddIcon { ...generic_button_icon_props } />}
                title={t("Add")}
                { ...generic_button_props("create") }
              /> }
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default React.memo(Toolbar)
