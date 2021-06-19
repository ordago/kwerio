import { Route } from "react-router-dom"
import React, { useState, useEffect } from "react"

import { components } from "../routes"
import PageNotFound from "../components/PageNotFound"

function useRoutes(moduleRoutes) {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    let inner = []

    function _append_to_inner(endpoint, source) {
      inner.push(
        <Route
          key={endpoint}
          exact
          path={endpoint}
          render={source[endpoint]}
        />
      )
    }

    for (let endpoint in components) {
      _append_to_inner(endpoint, components)
    }

    for (let endpoint in moduleRoutes) {
      _append_to_inner(endpoint, moduleRoutes)
    }

    inner.push(<Route key="/404" component={PageNotFound} />)

    setRoutes(inner)
  }, [moduleRoutes])

  return routes
}

export default useRoutes
