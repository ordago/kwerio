import { CircularProgress } from "@mui/material"
import React from "react"

function Suspense({ component }) {
  return (
    <React.Suspense fallback={<CircularProgress size={20} />}>
      {component}
    </React.Suspense>
  )
}

export default React.memo(Suspense)
