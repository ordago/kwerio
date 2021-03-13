import { Button, IconButton, Tooltip } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import React from "react"

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
}) {
  const history = useHistory()

  function _handle_click() {
    if (onBefore) {
      onBefore(checkedItems)
    }

    if (action === "create" && (action in endpoint)) {
      history.push(endpoint.create)
    }

    else if (action === "filter") {

    }

    else {
      request[action]({ requests, items: checkedItems })
    }

    if (onAfter) {
      onAfter(checkedItems)
    }
  }

  return (
    <>
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
