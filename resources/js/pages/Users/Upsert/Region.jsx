import { TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete"
import React from "react"

import { actions } from "../index.slice"

function Region() {
  const state = useSelector(state => state.users),
    { locale, timezone, locale_iso_format } = state.upsert,
    dispatch = useDispatch()

  let language = state.languages.filter(language => language.locale === locale.value)
  let localeIsoFormats = state.localeIsoFormats.filter(format => format.label === locale_iso_format.value)

  return (
    <>
      {/* Locale */}
      <Autocomplete
        options={state.languages}
        autoHighlight
        value={language.length > 0 ? language[0] : null}
        getOptionLabel={(option) => option.native_name}
        filterOptions={createFilterOptions({
          stringify: option => `${option.iso_name} ${option.native_name}`,
        })}
        onChange={(e, value) => {
          dispatch(actions.handleChange({
            name: locale.name,
            value: _.isNull(value) ? "" : value.locale,
          }))
        }}
        renderOption={(option) => (
          <>{option.iso_name} ({option.native_name})</>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a language"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />

      {/* Locale */}
      <Autocomplete
        options={state.timezones}
        autoHighlight
        value={timezone.value || null}
        getOptionLabel={(option) => option}
        renderOption={option => option}
        onChange={(e, value) => {
          dispatch(actions.handleChange({
            name: timezone.name,
            value,
          }))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a timezone"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />

      {/* Locale ISO Format */}
      <Autocomplete
        options={state.localeIsoFormats}
        autoHighlight
        value={localeIsoFormats.length > 0 ? localeIsoFormats[0] : null}
        getOptionLabel={(option) => option.example}
        renderOption={option => (
          <>{option.label} ({option.example})</>
        )}
        onChange={(e, value) => {
          dispatch(actions.handleChange({
            name: locale_iso_format.name,
            value: _.isNull(value) ? "" : value.label,
          }))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a format"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />

    </>
  )
}

export default React.memo(Region)
