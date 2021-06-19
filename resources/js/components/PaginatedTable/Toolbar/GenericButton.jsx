import { Button, IconButton, Tooltip } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import React, { useState } from "react"

import Suspense from "Kwerio/components/Suspense"

const DeleteConfirmDialog = React.lazy(() => import("./DeleteConfirmDialog.jsx"))

function GenericButton({
  useIcons,
  action,
  icon,
  onBefore,
  onAfter,
  checkedItems,
  title,
  iconSize,
  className,
  iconClassName,
  classes,
  request,
  requests,
  api,
  endpoint,
  onClick = null,
}) {
  const history = useHistory(),
    [delete_confirm_dialog, setConfirmDeleteDialog] = useState(false)

  function _handle_click(evt) {
    if (onClick) {
      return onClick(checkedItems, evt)
    }

    if (onBefore) {
      onBefore(checkedItems)
    }

    if (action === "create" && (action in endpoint)) {
      if (requests.create.url) {
        history.push(requests.create.url)
      } else {
        history.push(endpoint.create)
      }
    } else if (action === "filter") {
      throw new Error("Filter is not implemented yet")
    } else if (action === "delete") {
      setConfirmDeleteDialog(true)
    } else {
      request[action]({ requests, items: checkedItems })
    }

    if (onAfter) {
      onAfter(checkedItems)
    }
  }

  return (
    <>
      {delete_confirm_dialog && (
        <Suspense component={
          <DeleteConfirmDialog
            open={delete_confirm_dialog}
            onConfirm={() => request.delete({ requests, items: checkedItems })}
            onClose={() => setConfirmDeleteDialog(false)}
          />
        } />
      )}
      {useIcons && (
        <Tooltip title={title}>
          <IconButton
            className={iconClassName}
            size={iconSize}
            aria-label={title}
            onClick={_handle_click}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}
      {!useIcons && (
        <Button
          classes={classes}
          color="default"
          className={className}
          aria-label={title}
          startIcon={icon}
          onClick={_handle_click}
        >
          {title}
        </Button>
      )}
    </>
  )
}

export default React.memo(GenericButton)
