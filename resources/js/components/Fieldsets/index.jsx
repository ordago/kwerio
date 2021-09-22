import { Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import StarIcon from "@mui/icons-material/Star"
import _ from "lodash"

import PaginatedTable from "Kwerio/components/PaginatedTable/index.jsx"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"
import useUser from "Kwerio/hooks/useUser"

import { actions, adapter } from "./index.slice"
import services from "./index.service"
import useStyles from "./index.styles"
import api from "./routes"

function Fieldsets({ reducer = "fieldsets", endpoint }) {
  const moduleState = useSelector(state => state.module),
    state = useSelector(state => state.fieldsets),
    user = useUser(),
    t = useT(),
    classes = useStyles(),
    request = useRequest({ reducer, services: services({ actions, api, endpoint }) }),
    dispatch = useDispatch()

  return (
    <PaginatedTable
      abilitiesPrefix="fieldset_"
      toolbar
      reducer={reducer}
      adapter={adapter}
      actions={actions}
      api={api}
      endpoint={endpoint}
      requests={{
        index: {
          extraParams: {
            module: _.get(moduleState, "uid", null),
          },
        },
      }}
    />
  )
}

export default React.memo(Fieldsets)
