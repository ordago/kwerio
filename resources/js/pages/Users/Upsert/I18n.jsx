import { Grid, TextField, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete"
import React from "react"

import { actions } from "../index.slice"
import useT from "../../../hooks/useT"

function I18n() {
  const state = useSelector(state => state.users),
    t = useT(),
    { locale, timezone, locale_iso_format } = state.upsert,
    dispatch = useDispatch()

  let language = state.languages.filter(language => language.locale === locale.value)
  let localeIsoFormats = state.localeIsoFormats.filter(format => format.label === locale_iso_format.value)

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} md={4}>
        {/* Locale */}
        <Autocomplete
          options={state.languages}
          autoHighlight
          value={language.length > 0 ? language[0] : null}
          getOptionLabel={(option) => option.native_name}
          filterOptions={createFilterOptions({
            stringify: option => `${option.name} ${option.native_name}`,
          })}
          onChange={(e, value) => {
            dispatch(actions.handleChange({
              name: locale.name,
              value: _.isNull(value) ? "" : value.locale,
            }))
          }}
          renderOption={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a language"
              helperText={locale.error ? locale.helper_text : ""}
              error={locale.error}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </Grid>

      <Grid item sm={6} md={4}>
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
              helperText={timezone.error ? timezone.helper_text : ""}
              error={timezone.error}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </Grid>

      <Grid item sm={6} md={4}>
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
              helperText={locale_iso_format.error ? locale_iso_format.helper_text : ""}
              error={locale_iso_format.error}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}

export default React.memo(I18n)
