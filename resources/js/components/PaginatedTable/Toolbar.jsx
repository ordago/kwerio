import { Box, Button, Divider, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import React, { useState, useRef } from "react"

import Suspense from "../Suspense"
import useStyles from "./Toolbar.styles"
import useT from "../../hooks/useT"

const ConfirmDeletionDialog = React.lazy(() => import("./ConfirmDeletionDialog"))

let timer

function Toolbar({
  // Actions.
  actions,
  api,
  endpoint,
  request,              // useRequest
  requests,             // Supported requests by the table
  reducer = "module",
  addButtons = () => [],

  // Labels
  searchLabel = null,
  createButtonLabel = null,

  // Abilities
  canSearch = false,
  canCreate = false,
  canDelete = false,

  // From table
  nbChecked,
  itemsToDelete,
}) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory(),
    [q, setQ] = useState(""),
    q_ref = useRef(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    [open_confirm_deletion_dialog, setOpenConfirmDeletionDialog] = useState(false)

  if (searchLabel === null) searchLabel = t("Search")
  if (createButtonLabel === null) createButtonLabel = t("Create new")

  q_ref.current = q

  function handleChange(e) {
    setQ(e.target.value)
    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch(actions.removeAll())
      dispatch(actions.setQ(q_ref.current))
      request.index()
    }, 1000)
  }

  return (
    <>
      {(canSearch || canCreate) && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            px={1}
            pt={1}
            alignItems="flex-start"
          >
            <Box>
              {canSearch && (
                <TextField
                  label={searchLabel}
                  name="search"
                  type="search"
                  onChange={handleChange}
                  value={q}
                />
              )}
            </Box>

            <Box>
              {addButtons()}
              {canDelete && nbChecked > 0 && (
                <>
                  <Button
                    className={classes.deleteBtn}
                    onClick={() => setOpenConfirmDeletionDialog(true)}
                  >
                    Delete {nbChecked} items
                  </Button>

                  {open_confirm_deletion_dialog && (
                    <Suspense component={<ConfirmDeletionDialog
                      open={open_confirm_deletion_dialog}
                      classes={classes}
                      nbChecked={nbChecked}
                      onClose={() => setOpenConfirmDeletionDialog(false)}
                      onDelete={() => {
                        request
                          .delete({ requests, items: itemsToDelete })
                          .then(() => {
                            setOpenConfirmDeletionDialog(false)
                          })
                      }}
                    />} />
                  )}
                </>
              )}
              {canCreate && (
                <Button onClick={() => history.push(endpoint.create)}>
                  {createButtonLabel}
                </Button>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}
    </>
  )
}

export default React.memo(Toolbar)
