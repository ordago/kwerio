import { Box, Button, CircularProgress } from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import React from "react"

const useStyles = makeStyles(theme => createStyles({
  wrapper: {
    position: "relative",
    margin: theme.spacing(1),
  },
  progress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}))

function InteractiveButton({
  children,
  loading,
  disabled = false,
  onClick = () => {},
}) {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Button
        onClick={onClick}
        disabled={(() => {
          if (loading) return true
          if (typeof disabled === "function") return disabled()
          return disabled
        })()}
      >
        {children}
      </Button>

      {loading && <CircularProgress size={24} className={classes.progress} />}
    </Box>
  )
}

export default React.memo(InteractiveButton)
