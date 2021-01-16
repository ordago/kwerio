import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import clsx from "clsx"
import { merge } from "lodash"

import { init_services } from "./index"
import Suspense from "../Suspense"
import useRequest from "../../hooks/useRequest"
import useStyles from "./index.styles"
import useT from "../../hooks/useT"

const Toolbar = React.lazy(() => import("./Toolbar.jsx"))

function PaginatedTable({
  reducer,                      // Reducer name.
  adapter,                      // Data to display in the table.
  actions,                      // Slice actions.
  api,                          // Api to use for making requests.
  endpoint,                     // Endpoints for the current entity.
  hover = true,                 // Enable hover on the table.
  canCheck = true,              // Rows can be checked using checkbox.
  renderCell = null,            // Custom cell renderer.
  onRowClick = () => { },       // Click event for the row.
  onSort = () => { },           // Callback to handle sorting.
  primaryKey = "uuid",          // Primary key used in the data as 'id'.
  slugKey = "slug",             // Name of the slug key.
  size = "small",               // Size of the table. (medium, small).

  // Components..
  toolbar = false,              // Show table toolbar
  addButtons = () => [],
  canSearch = false,
  canCreate = false,
  canDelete = false,
  searchLabel = null,
  createButtonLabel = null,

  // Customize request
  requests = { },
}) {
  const dispatch = useDispatch(),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    classes = useStyles(),
    translations = useSelector(state => state.app.t),
    t = useT(translations),
    request = useRequest({ reducer, services: init_services(api, actions) })

  const defaultRequests = {
    index: {                      // Index request.
      url: null,                  // Url to make the request to.
      method: "post",             // Type of request method.
      requestBody: null,          // Request body to be sent.
      convertResponseBody: null,  // Converts response body to an acceptable format by the table.
    },
    delete: {                     // Delete request.
      url: null,
      method: "delete",
      requestBody: null,
      convertResponseBody: null,
    },
  }

  requests = merge(defaultRequests, requests)

  let data = selector.selectAll(state),
    offset = state.page * state.per_page

  data = data.slice(offset, offset + state.per_page)

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

  const checkedItems = selector.selectAll(state).filter(item => ("checked" in item) && item.checked === true),
    nb_checked = checkedItems.length

  let checkbox_all = { }

  React.useEffect(() => {
    if (nb_checked > 0) {
      _toggle_check_all(false)
    }

    request.index({ requests }).then(() => {
      dispatch(actions.moveTouchedToStart())
    })
  }, [])

  if (nb_checked > 0 && nb_checked < data.length) {
    checkbox_all = { indeterminate: true }
  }

  return (
    <Box>
      {toolbar && (
        <Suspense component={<Toolbar
            request={request}
            requests={requests}
            actions={actions}
            api={api}
            endpoint={endpoint}
            reducer={reducer}
            canSearch={canSearch}
            canCreate={canCreate}
            canDelete={canDelete}
            searchLabel={searchLabel}
            createButtonLabel={createButtonLabel}
            nbChecked={nb_checked}
            itemsToDelete={checkedItems}
            addButtons={addButtons}
          />
        } />
      )}

      <TableContainer className={classes.root}>
        <Table size={size}>
          <TableHead>
            <TableRow>
              {canCheck && (
                <TableCell>
                  <Checkbox
                    { ...checkbox_all }
                    checked={nb_checked > 0}
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
              )}
              {state.columns.map(col => (
                <TableCell key={col[slugKey]}>
                  {col.sort && (
                    <TableSortLabel
                      active={true}
                      direction={col.sortDirection}
                      onClick={() => {
                        if (nb_checked > 0) {
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
                onClick={() => onRowClick(row)}
                className={clsx({ [classes.touchedAt]: ("touched_at" in row) })}
              >
                {canCheck && (
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
                )}
                {state.columns.map(col => {
                  if (typeof renderCell === "function") {
                    return renderCell(row, col)
                  }

                  return (
                    <TableCell key={col[slugKey]}>
                      {row[col[slugKey]]}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPage={state.per_page}
                page={state.page}
                onChangePage={(_, page) => {
                  if (nb_checked > 0) {
                    _toggle_check_all(false)
                  }

                  dispatch(actions.setPage(page))
                  request.index({ requests })
                }}
                onChangeRowsPerPage={e => {
                  if (nb_checked > 0) {
                    _toggle_check_all(false)
                  }

                  dispatch(actions.setPerPage(e.target.value))
                  request.index({ requests })
                }}
                count={state.rsc.total || 0}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(PaginatedTable)
