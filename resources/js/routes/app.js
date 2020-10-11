const API_ENDPOINT = '/api',
  ENDPOINT = ''

const API_PERMISSIONS_ENDPOINT = `${API_ENDPOINT}/account/permissions`
const API_MODULES_ENDPOINT = `${API_ENDPOINT}/modules`

const PERMISSIONS_ENDPOINT = `${ENDPOINT}/account/permissions`
const MODULES_ENDPOINT = `${ENDPOINT}/modules`

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,
  users: {
    index: `${API_PERMISSIONS_ENDPOINT}/users`,
  },
  modules: {
    index: `${API_MODULES_ENDPOINT}/modules`,
  },
}

export const endpoints = {
  account: {
    permissions: {
      users: {
        index: `${PERMISSIONS_ENDPOINT}/users`,
      },
    },
  },
  modules: {
    index: `${MODULES_ENDPOINT}`,
  },
}
