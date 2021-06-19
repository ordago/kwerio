import { Typography } from "@material-ui/core"
import React from "react"

import useT from "../hooks/useT"

function PageNotFound() {
  const t = useT()

  return (
    <Typography variant="caption">{t("404, Not Found!")}</Typography>
  )
}

export default React.memo(PageNotFound)
