import { Alert, AlertTitle } from "@mui/lab"
import React from "react"

function Forbidden() {
  return (
    <Alert severity="error">
      <AlertTitle>Forbidden</AlertTitle>
      This action is unauthorized. <strong>(incident will be reported)</strong>.
    </Alert>
  )
}

export default React.memo(Forbidden)
