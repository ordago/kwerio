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

function ConfirmDuplicationDialog({
  open = false,
  nbChecked,
  onClose,
  onDuplicate,
  classes,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Confirm Duplication</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure, you want to duplicate {nbChecked} items?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} color="primary" autoFocus>
          cancel
        </Button>
        <Button variant="text" onClick={onDuplicate} color="primary" classes={{
          textPrimary: classes.duplicateBtnTextPrimary,
        }}>
          continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(ConfirmDuplicationDialog)
