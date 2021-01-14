import React from 'react'
import Suspense from 'Kwerio/components/Suspense'

const Home = React.lazy(() => import("./pages/Home"))

const ENDPOINT = "",
  API_ENDPOINT = "/_/home/api"

export const endpoints = {
  index: `${ENDPOINT}`,
}

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,
}

export const components = {
  [endpoints.index]: props => <Suspense component={<Home />} />,
}
