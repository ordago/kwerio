import { Box, TextField } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import FilterListIcon from "@mui/icons-material/FilterList"
import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import React, { useState, useRef } from "react"
import RefreshIcon from "@mui/icons-material/Refresh"
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
  onRefreshClick,
  primaryKey,

  showSearchBox = true,

  // User
  extraButtons = [],
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
    refresh: false,
  }

  let defaultAbilitiesFn = {},
    defaultAfterHooksFn = {},
    defaultBeforeHooksFn = {},
    defaultRequests = {}

  for (let action in defaultAbilities) {
    defaultAbilitiesFn[action] = checkedItems => true
    defaultAfterHooksFn[action] = () => {}
    defaultBeforeHooksFn[action] = () => {}
    defaultRequests[action] = { ...requestTemplate }
  }

  defaultRequests.delete.method = "delete"

  abilities.refresh = ("refresh" in abilities) ? abilities.refresh : !!abilities.index
  defaultAbilities.refresh = ("refresh" in abilities) ? abilities.refresh : !!abilities.index

  if (abilitiesPrefix) {
    for (let ability in defaultAbilities) {
      if (!(ability in abilities)) {
        let is_able = user.can(`${abilitiesPrefix}${ability}`)

        if (is_able && ! ((ability in api) || (ability in endpoint))) {
          is_able = false
        }

        abilities[ability] = is_able
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
    }, 200)
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
    fontSize: iconSize === "medium" ? "medium" : iconSize
  }

  function _is_allowed(action, require_checked_items_length = true) {
    if (require_checked_items_length && checkedItems.length === 0) return false
    if (abilities[action] === false) return false
    if (abilitiesFn[action](checkedItems) === false) return false

    return true
  }

  function _is_allowed_extra_button(button, checkedItems) {
    if ("isAllowed" in button) {
      if (typeof button.isAllowed === "boolean") return button.isAllowed
      return button.isAllowed(checkedItems)
    }

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
              {showSearchBox && abilities.index && ( <TextField
                label={t("Search")}
                name="search"
                type="search"
                onChange={handleChange}
                value={q}
              />)}
            </Box>

            <Box>
              {extraButtons.map(button => (
                _is_allowed_extra_button(button, checkedItems) && <GenericButton
                  key={button.title}
                  useIcons={useIcons}
                  icon={("iconFn" in button) ? button.iconFn(generic_button_icon_props) : null}
                  iconSize={iconSize}
                  checkedItems={checkedItems}
                  className={classes.genericBtn}
                  { ...button }
                />
              ))}

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

              {abilities.refresh && abilitiesFn.create() && <GenericButton
                icon={<RefreshIcon { ...generic_button_icon_props } />}
                title={t("Refresh")}
                onClick={onRefreshClick}
                { ...generic_button_props("refresh") }
              /> }
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default React.memo(Toolbar)
