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
import { useSnackbar } from "notistack"

import _ from "lodash"

import { notify } from "../../utils/errors"
import useStyles from "./index.styles"

function PaginatedTable({
  reducerName,                  // Reducer name.
  adapter,                      // Data to display in the table.
  actions,                      // Slice actions.
  asyncActions,                 // Slice async actions.
  hover = true,                 // Enable hover on the table.
  canCheck = true,              // Rows can be checked using checkbox.
  renderCell = null,            // Custom cell renderer.
  onRowClick = () => { },       // Click event for the row.
  onSort = () => { },           // Callback to handle sorting.
}) {
  const dispatch = useDispatch(),
    state = useSelector(state => state[reducerName]),
    { enqueueSnackbar } = useSnackbar(),
    selector = adapter.getSelectors(),
    classes = useStyles()

  let data = selector.selectAll(state),
    offset = state.page * state.per_page

  data = data.slice(offset, offset + state.per_page)

  React.useEffect(() => {
    dispatch(asyncActions.index())
      .then(action => notify(action, enqueueSnackbar))
  }, [])

  return (
    <Box>
      <TableContainer className={classes.root}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {canCheck && (
                <TableCell>
                  <Checkbox
                    checked={state.all_checked}
                    color="primary"
                    onChange={e => dispatch(actions.toggleCheckAll(e.target.checked))}
                    onClick={e => e.stopPropagation()}
                  />
                </TableCell>
              )}
              {state.columns.map(col => (
                <TableCell key={col.slug}>
                  {col.sort && (
                    <TableSortLabel
                      active={true}
                      direction={col.sortDirection}
                      onClick={() => onSort(col.slug, col.sortDirection)}
                    >
                      {col.label}
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
                selected={row.checked}
                key={row.uuid}
                onClick={() => onRowClick(row)}
              >
                {canCheck && (
                  <TableCell key={row.uuid}>
                    <Checkbox
                      checked={row.checked}
                      onChange={e => dispatch(actions.toggleCheck({
                        uuid: row.uuid,
                        checked: e.target.checked,
                      }))}
                      onClick={e => e.stopPropagation()}
                      color="primary"
                      value={row.uuid}
                    />
                  </TableCell>
                )}
                {state.columns.map(col => {
                  if (_.isFunction(renderCell)) {
                    return renderCell(row, col)
                  }

                  return (
                    <TableCell key={col.slug}>
                      {row[col.slug]}
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
                onChangePage={(_, page) => dispatch(asyncActions.onChangePage(page))}
                onChangeRowsPerPage={e => dispatch(asyncActions.onChangeRowsPerPage(e.target.value))}
                count={state.rsc.total}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(PaginatedTable)
