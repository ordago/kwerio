import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import _ from "lodash"

export default function({
  reducer,
  adapter,
  request,
  actions,
  resetUpsert = true,
}) {
  const params = useParams(),
    uuid = _.get(params, "uuid"),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    item = selector.selectById(state, uuid),
    dispatch = useDispatch()

  useEffect(() => {
    // Fetch item if not in store.
    if (!_.isUndefined(uuid) && _.isUndefined(item)) {
      request.fetch_by_uuid(uuid)
    }

    // Fill item upsert from store.
    else if (!_.isUndefined(item)) {
      dispatch(actions.resetUpsert())
      dispatch(actions.fillUpsert(item))
    }

    // We are creating a new item, reset upsert.
    else if (resetUpsert) {
      dispatch(actions.resetUpsert())
    }
  }, [])

  return uuid
}
