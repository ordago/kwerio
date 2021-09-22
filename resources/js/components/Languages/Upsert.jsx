import { Card, CardActions, CardContent, TextField } from "@mui/material"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete"
import React from "react"

import InteractiveButton from "Kwerio/components/InteractiveButton"
import _ from "lodash"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"
import useUuid from "Kwerio/hooks/useUuid"

import { actions, adapter } from "./index.slice"
import api from "./routes"
import services from "./index.service"

function Upsert({ endpoint }) {
  const request = useRequest({ reducer: "languages", services: services({ actions, api, endpoint }) }),
    uuid = useUuid({ reducer: "languages", adapter, request, actions }),
    t = useT(),
    moduleState = useSelector(state => state.module),
    state = useSelector(state => state.languages),
    dispatch = useDispatch(),
    selector = adapter.getSelectors(),
    module_uid = _.get(moduleState, "uid", null)

  React.useEffect(() => { request.metadata({ module: module_uid }) }, [])

  let language = state.languages.filter(language => language.locale === state.upsert.locale.value)
  let selected = selector.selectAll(state)

  return (
    <Card>
      <CardContent>
        {/* Languages */}
        <Autocomplete
          options={state.languages}
          autoHighlight
          value={language.length > 0 ? language[0] : null}
          getOptionLabel={(option) => option.native_name}
          getOptionDisabled={option => option.disabled}
          filterOptions={createFilterOptions({
            stringify: option => `${option.name} ${option.native_name}`,
          })}
          onChange={(e, value) => {
            dispatch(actions.handleChange({
              name: state.upsert.locale.name,
              value: value ? value.locale : "",
            }))
          }}
          renderOption={(option) => option.name}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              label={t("Choose a language")}
              error={state.upsert.locale.error}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </CardContent>

      <CardActions>
        <InteractiveButton
          loading={state.loading}
          disabled={is_disabled({
            locale: state.upsert.locale,
          })}
          onClick={() => request.upsert({ module: module_uid })}
        >
          {t("Save")}
        </InteractiveButton>
      </CardActions>
    </Card>
  )
}

export default React.memo(Upsert)
