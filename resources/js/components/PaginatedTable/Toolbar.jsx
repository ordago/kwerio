import { Box, Button, Divider, TextField } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import React, { useState, useRef } from "react"

import Suspense from "../Suspense"
import useStyles from "./Toolbar.styles"
import useT from "../../hooks/useT"

const ConfirmDeletionDialog = React.lazy(() => import("./ConfirmDeletionDialog")),
  ConfirmDuplicationDialog = React.lazy(() => import("./ConfirmDuplicationDialog"))

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
  canDuplicate = false,

  // From table
  nbChecked,
  itemsToDelete,
  itemsToDuplicate,
}) {
  const classes = useStyles(),
    dispatch = useDispatch(),
    history = useHistory(),
    [q, setQ] = useState(""),
    q_ref = useRef(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    [open_confirm_deletion_dialog, setOpenConfirmDeletionDialog] = useState(false),
    [open_confirm_duplication_dialog, setOpenConfirmDuplicationDialog] = useState(false)

  if (searchLabel === null) searchLabel = t("Search")
  if (createButtonLabel === null) createButtonLabel = t("Create new")

  q_ref.current = q

  function handleChange(e) {
    setQ(e.target.value)
    clearTimeout(timer)

    timer = setTimeout(() => {
      dispatch(actions.removeAll())
      dispatch(actions.setQ(q_ref.current))
      request.index({ requests })
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
              {canDuplicate && nbChecked > 0 && (
                <>
                  <Button
                    className={classes.duplicateBtn}
                    startIcon={<FileCopyIcon />}
                    onClick={() => setOpenConfirmDuplicationDialog(true)}
                  >
                    duplicate {nbChecked} items
                  </Button>

                  {open_confirm_duplication_dialog && (
                    <Suspense component={<ConfirmDuplicationDialog
                      open={open_confirm_duplication_dialog}
                      classes={classes}
                      nbChecked={nbChecked}
                      onClose={() => setOpenConfirmDuplicationDialog(false)}
                      onDuplicate={() => {
                        request
                          .duplicate({ requests, items: itemsToDuplicate })
                          .then(() => {
                            setOpenConfirmDuplicationDialog(false)
                          })
                      }}
                    />} />
                  )}
                </>
              )}
              {canDelete && nbChecked > 0 && (
                <>
                  <Button
                    className={classes.deleteBtn}
                    onClick={() => setOpenConfirmDeletionDialog(true)}
                    startIcon={<DeleteIcon />}
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
                <Button
                  onClick={() => history.push(endpoint.create)}
                  startIcon={<AddIcon />}
                >
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
