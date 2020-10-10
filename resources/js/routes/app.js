const API_ENDPOINT = '/api',
  ENDPOINT = ''

const API_PERMISSIONS_ENDPOINT = `${API_ENDPOINT}/account/permissions`
const PERMISSIONS_ENDPOINT = `${ENDPOINT}/account/permissions`

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,
  users: {
    index: `${API_PERMISSIONS_ENDPOINT}/users`,
  },
}

export const endpoints = {
  account: {
    permissions: {
      users: `${PERMISSIONS_ENDPOINT}/users`
    },
  }
}
