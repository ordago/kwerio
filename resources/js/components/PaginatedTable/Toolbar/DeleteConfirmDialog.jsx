import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery
} from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import React from "react"

import useT from "Kwerio/hooks/useT"

function DeleteConfirmDialog({ open, onClose, onConfirm }) {
  const theme = useTheme(),
    fullScreen = useMediaQuery(theme.breakpoints.down('sm')),
    t = useT()

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      onClose={onClose}
    >
      <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("Are you sure you want to delete the selected items ?")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => onClose()}>Cancel</Button>
        <Button
          color="secondary"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeleteConfirmDialog)
