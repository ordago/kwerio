import { Card, CardContent } from "@mui/material"
import { useSelector } from "react-redux"
import React from "react"

import AccountMenu from "../../components/Menus/AccountMenu"
import Page from "../../components/Page"
import useT from "../../hooks/useT"

function Profile({ match }) {
  const translations = useSelector(state => state.app.t),
    t = useT(translations)

  return (
    <Page
      title={t("Profile")}
      content={() => (
        <Card>
          <CardContent>User Profile</CardContent>
        </Card>
      )}
    />
  )
}

export default React.memo(Profile)
