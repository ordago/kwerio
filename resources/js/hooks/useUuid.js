import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useSnackbar } from "notistack"

import _ from "lodash"

import { notify } from "../utils/errors"

export default function({ reducer, match, adapter, asyncActions, actions }) {
  const uuid = _.get(match, "params.uuid"),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    enqueueSnackbar = useSnackbar(),
    item = selector.selectById(state, uuid),
    dispatch = useDispatch()

  useEffect(() => {
    if (!_.isUndefined(uuid) && _.isUndefined(item)) {
      dispatch(asyncActions.fetch_by_uuid(uuid))
        .then(action => notify(action, enqueueSnackbar))
    }

    else if (!_.isUndefined(item)) {
      dispatch(actions.fillUpsert(item))
    }

    else {
      dispatch(actions.resetUpsert())
    }
  }, [])

  return uuid
}
