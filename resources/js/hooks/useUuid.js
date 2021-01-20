import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import _ from "lodash"

export default function({
  reducer,
  adapter,
  request,
  actions,
}) {
  const params = useParams(),
    uuid = _.get(params, "uuid"),
    state = useSelector(state => state[reducer]),
    selector = adapter.getSelectors(),
    item = selector.selectById(state, uuid),
    dispatch = useDispatch()

  useEffect(() => {
    if (!_.isUndefined(uuid) && _.isUndefined(item)) request.fetch_by_uuid(uuid)
    else if (!_.isUndefined(item)) dispatch(actions.fillUpsert(item))
    else dispatch(actions.resetUpsert())
  }, [])

  return uuid
}
