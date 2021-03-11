import { Button } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import StarIcon from "@material-ui/icons/Star"
import _ from "lodash"

import PaginatedTable from "Kwerio/components/PaginatedTable/index.jsx"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"
import useUser from "Kwerio/hooks/useUser"

import { actions, adapter } from "./index.slice"
import services from "./index.service"
import useStyles from "./index.styles"
import api from "./routes"

function Languages({ reducer = "languages", endpoint }) {
  const moduleState = useSelector(state => state.module),
    state = useSelector(state => state.languages),
    user = useUser(),
    t = useT(),
    classes = useStyles(),
    request = useRequest({ reducer, services: services({ actions, api, endpoint }) }),
    dispatch = useDispatch()

  return (
    <PaginatedTable
      toolbar
      addButtons={items => (
        <>
          {user.can("language_set_as_default") && items.length === 1 && items[0].default_at === null && (
            <Button
              className={classes.setAsDefaultBtn}
              startIcon={<StarIcon />}
              onClick={() => request.setAsDefault(items[0])}
            >
              {t("set as default language")}
            </Button>
          )}
        </>
      )}
      requests={{
        index: {
          extraParams: {
            module: _.get(moduleState, "uid", null),
          },
        },
        delete: {
          extraParams: {
            module: _.get(moduleState, "uid", null),
          },
        },
      }}
      canIndex={user.can("language_index")}
      afterIndexFn={() => dispatch(actions.loaded())}
      canSearch={user.can("language_index")}
      canCreate={user.can("language_create")}
      canDelete={user.can("language_delete")}
      canDeleteFn={items => items.length > 1 || (items[0].default_at === null)}
      afterDeleteFn={action => {
        dispatch(actions.setLanguagesDisabledTo({
          items: action.payload.items,
          disabled: false,
        }))
      }}
      reducer={reducer}
      adapter={adapter}
      actions={actions}
      api={api}
      endpoint={endpoint}
      disableRowClick={true}
      highlightRowIf={[{
        classes: classes.defaultLanguage,
        condition: (row) => row.default_at !== null,
      }]}
    />
  )
}

export default React.memo(Languages)
