import { Autocomplete } from "@material-ui/lab"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField
} from "@material-ui/core"
import { is_disabled } from "@euvoor/form"
import { useDispatch, useSelector } from "react-redux"
import React from "react"

import { actions, fetch_metadata, update_or_create } from "../index.slice"
import Header from "../Header"
import OneColumnPage from "../../Page/OneColumnPage"
import useStyles from "./index.styles"

function UpdateOrCreate() {
  const classes = useStyles(),
    state = useSelector(state => state.groups),
    { name, modules } = useSelector(state => state.groups.update_or_create),
    dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(fetch_metadata())
  }, [])

  return (
    <Box className={classes.root}>
      <Header title="Create new group" />

      <OneColumnPage className={classes.oneColumnPage}>
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
              value={modules.value}
              filterSelectedOptions
              options={state.modules}
              getOptionLabel={option => option.name}
              getOptionSelected={(option, value) => option.uid === value.uid}
              onChange={(e, value, reason) => dispatch(actions.handleChange({ name: modules.name, value }))}
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
          </CardContent>

          <CardActions>
            <Button
              disabled={is_disabled({ name })}
              onClick={() => dispatch(update_or_create())}
            >
              save
            </Button>
          </CardActions>
        </Card>

      </OneColumnPage>
    </Box>
  )
}

export default React.memo(UpdateOrCreate)
