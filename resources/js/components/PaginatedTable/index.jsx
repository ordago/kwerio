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

import _ from "lodash"

import useStyles from "./index.styles"

function PaginatedTable({
  reducer,                      // slice reducer
  actions,                      // slice actions
  asyncActions,                 // slice async actions
  hover = true,                 // enable hover on the table
  canCheck = true,              // rows can be checked using checkbox
  onRowClick = () => { },       // click event for the row
  renderCell = null,            // custom cell renderer
}) {
  const state = useSelector(state => _.get(state, reducer, undefined)),
    dispatch = useDispatch(),
    classes = useStyles()

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
                      onClick={() => dispatch(asyncActions.sortBy({
                        slug: col.slug,
                        direction: col.sortDirection,
                      }))}
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
            {state.data.map(row => (
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
                rowsPerPageOptions={[10, 25, 50, 100]}
                rowsPerPage={state.per_page}
                page={state.current_page}
                onChangePage={(_, page) => dispatch(asyncActions.onChangePage(page))}
                onChangeRowsPerPage={e => dispatch(asyncActions.onChangeRowsPerPage(e.target.value))}
                count={state.total}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(PaginatedTable)
