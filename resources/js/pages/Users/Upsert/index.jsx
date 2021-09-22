import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider
} from "@mui/material"
import { is_disabled } from "@euvoor/form"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"
import React from "react"

import _ from "lodash"

import { actions, adapter, asyncActions } from "../index.slice"
import { endpoints } from "../../../routes"
import { notify } from "../../../utils/errors"
import AccountMenu from "../../../components/Menus/AccountMenu"
import Groupable from "../../../components/Groupable/index.jsx"
import I18n from "./I18n"
import Page from "../../../components/Page"
import PersonalInfo from "./PersonalInfo"
import useT from "../../../hooks/useT"
import useUuid from "../../../hooks/useUuid"
import { actions as appActions } from '../../../App.slice.js'
import useRequest from '../../../hooks/useRequest'
import services from '../index.service'

function Upsert({ match }) {
  const state = useSelector(state => state.users),
    { email, first_name, last_name, locale } = state.upsert,
    history = useHistory(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    request = useRequest({ reducer: "users", services: services({ actions }) }),
    uuid = useUuid({ reducer: "users", match, adapter, request, actions })

  React.useEffect(() => { request.metadata() }, [])

  return (
    <Page
      loading={state.loading}
      menu="app.menu.data[1].children[0].children"
      menuActions={appActions}
      title={t("Users")}
      content={() => (
        <Card>
          <CardContent>
            <PersonalInfo />
            <Divider />

            <I18n />
            <Divider />

            <Groupable
              state={state}
              actions={actions}
            />

          </CardContent>

          <CardActions>
            <Button
              disabled={is_disabled({ email })}
              onClick={() => { request.upsert() }}
            >
              save
            </Button>
          </CardActions>
        </Card>
      )}
    />
  )
}

export default React.memo(Upsert)
