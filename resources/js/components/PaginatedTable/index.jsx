import {
  Box,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import React from "react"
import clsx from "clsx"

import Suspense from "Kwerio/components/Suspense"
import _ from "lodash"
import useRequest from "Kwerio/hooks/useRequest"
import useT from "Kwerio/hooks/useT"
import useUser from "Kwerio/hooks/useUser"

import { requestTemplate } from "./utils"
import services from "./index.service"
import useStyles from "./index.styles"

const Toolbar = React.lazy(() => import("./Toolbar/index.jsx"))

function PaginatedTable({
  reducer,                      // Reducer name.
  adapter,                      // Data to display in the table.
  actions,                      // Slice actions.
  api,                          // Api to use for making requests.
  endpoint,                     // Endpoints for the current entity.

  hover = true,                 // Enable hover on the table.
  primaryKey = "uuid",          // Primary key used in the data as 'id'.
  slugKey = "slug",             // Name of the slug key.
  size = "small",               // Size of the table. (medium, small).

  requests = {},
  disableRowClick = false,      // Disable row click.
  highlightRowIf = [],          // Highligh row if the given condition is met.

  abilitiesPrefix = null,
  abilities = {},

  afterIndexFn = data => data,
  renderCell = null,            // Custom cell renderer.

  onRowClick = null,            // Click event for the row.
  onSort = () => {},            // Callback to handle sorting.

  toolbar = null,
}) {
  const dispatch = useDispatch(),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    t = useT(),
    request = useRequest({ reducer, services: services({ api, actions, primaryKey }) }),
    history = useHistory(),
    user = useUser()

  // Set defaults
  const defaultAbilities = {
    index: false,
  }

  const defaultRequests = {
    index: { ...requestTemplate },
  }

  // Build abilities from the prefix.
  if (abilitiesPrefix) {
    for (let ability in defaultAbilities) {
      if (!(ability in abilities)) {
        abilities[ability] = user.can(`${abilitiesPrefix}${ability}`)
      }
    }
  }

  // Prepare requests and abilities.
  requests = _.merge(defaultRequests, requests)
  abilities = _.merge(defaultAbilities, abilities)

  // Get data to display on the table.
  let data = selector.selectAll(state),
    offset = state.page * state.per_page,
    checkbox_all = {}

  data = data.slice(offset, offset + state.per_page)

  // Set proper icon for global checkbox.
  const checkedItems = selector.selectAll(state)
    .filter(item => ("checked" in item) && item.checked === true)

  if (checkedItems.length > 0 && checkedItems.length < data.length) {
    checkbox_all = { indeterminate: true }
  }

  // Pass table index ability to toolbar.
  if (toolbar) {
    if (typeof toolbar !== "object") {
      toolbar = {}
    }

    if (!("abilities" in toolbar)) {
      toolbar.abilities = {}
    }

    if (!_.hasIn(toolbar, "abilities.index")) {
      toolbar.abilities.index = abilities.index
    }
  }

  /**
   * Toggle checked attribute of all items in the cache.
   *
   * @param {boolran} checked
   */
  function _toggle_check_all(checked) {
    dispatch(actions.updateMany(selector.selectIds(state).map(id => ({
      id,
      changes: { checked }
    }))))
  }

  /**
   * Get the value associated with a column.
   */
  function _get_value(row, col) {
    if ("path" in col) {
      return _.get(row, col.path)
    }

    return row[col[slugKey]]
  }

  React.useEffect(() => {
    if (!abilities.index) return
    if (checkedItems.length > 0) _toggle_check_all(false)

    request.index({ requests }).then(action => {
      dispatch(actions.moveTouchedToStart())
      afterIndexFn(action)
    })
  }, [abilities.index])

  return (
    <Box>
      {toolbar !== null && (
        <>
          <Suspense component={
            <Toolbar
              actions={actions}
              abilitiesPrefix={abilitiesPrefix}
              api={api}
              endpoint={endpoint}
              reducer={reducer}
              checkedItems={checkedItems}
              onQuery={() => request.index({ requests })}
              onRefreshClick={() => {
                dispatch(actions.resetTableState())
                dispatch(actions.removeAll())

                request.index({ requests })
              }}
              primaryKey={primaryKey}
              {...toolbar}
            />}
          />

          <Divider />
        </>
      )}

      {abilities.index && (
        <TableContainer className={classes.root}>
          <Table size={size}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    { ...checkbox_all }
                    checked={checkedItems.length > 0}
                    color="primary"
                    onChange={e => {
                      const updates = data.map(item => ({
                          id: item[primaryKey],
                          changes: { checked: e.target.checked }
                        }))

                      dispatch(actions.updateMany(updates))
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                </TableCell>
                {state.columns && state.columns.map(col => (
                  <TableCell key={col[slugKey]}>
                    {col.sort && (
                      <TableSortLabel
                        active={true}
                        direction={col.sortDirection}
                        onClick={() => {
                          if (checkedItems.length > 0) {
                            _toggle_check_all(false)
                          }

                          dispatch(actions.removeAll())
                          dispatch(actions.handleSort(col))
                          request.index({ requests })
                        }}
                      >
                        {t(col.label)}
                      </TableSortLabel>
                    )}
                    {!col.sort && (col.label)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map(row => (
                <TableRow
                  hover={hover}
                  selected={("checked" in row) && row.checked === true}
                  key={row[primaryKey]}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row)
                    } else if (!disableRowClick) {
                      history.push(endpoint.update.replace(/:uuid/, row[primaryKey]))
                    }
                  }}
                  className={(() => {
                    let highlights = { }

                    for (let i = 0; i < highlightRowIf.length; i ++) {
                      highlights[highlightRowIf[i].classes] = highlightRowIf[i].condition(row)
                    }

                    highlights[classes.touchedAt] = ("touched_at" in row)

                    return clsx(highlights)
                  })()}
                >
                  <TableCell key={row[primaryKey]}>
                    <Checkbox
                      checked={("checked" in row) && row.checked === true}
                      onChange={e => dispatch(actions.updateOne({
                        id: row[primaryKey],
                        changes: { checked: e.target.checked }
                      }))}
                      onClick={e => e.stopPropagation()}
                      color="primary"
                      value={row[primaryKey]}
                    />
                  </TableCell>
                  {state.columns.map(col => {
                    if (typeof renderCell === "function") {
                      return renderCell(row, col)
                    }

                    return (
                      <TableCell key={col[slugKey]} align={col.align || "inherit"}>
                        {_get_value(row, col)}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage={`${t("Rows per page")}:`}
                  labelDisplayedRows={({ from, to, count }) => (
                    `${from}-${to} ${t("of")} ${count !== -1 ? count : `${t("more than")} ${to}`}`
                  )}
                  rowsPerPage={state.per_page}
                  page={state.page}
                  onPageChange={(_, page) => {
                    if (checkedItems.length > 0) {
                      _toggle_check_all(false)
                    }

                    dispatch(actions.setPage(page))
                    request.index({ requests })
                  }}
                  onRowsPerPageChange={e => {
                    if (checkedItems.length > 0) {
                      _toggle_check_all(false)
                    }

                    dispatch(actions.setPerPage(e.target.value))
                    request.index({ requests })
                  }}
                  count={_.get(state.rsc, "total", 0)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

    </Box>
  )
}

export default React.memo(PaginatedTable)
