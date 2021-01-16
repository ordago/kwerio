import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import React from "react"

function ConfirmDeletionDialog({
  open = false,
  nbChecked,
  onClose,
  onDelete,
  classes,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure, you want to delete {nbChecked} items?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} color="primary" autoFocus>
          cancel
        </Button>
        <Button variant="text" onClick={onDelete} color="primary" classes={{
          textPrimary: classes.deleteBtnTextPrimary,
        }}>
          continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(ConfirmDeletionDialog)
