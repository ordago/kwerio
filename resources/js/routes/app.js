const API_ENDPOINT = '/api',
  ENDPOINT = ''

const API_PERMISSIONS_ENDPOINT = `${API_ENDPOINT}/account/permissions`
const API_MODULES_ENDPOINT = `${API_ENDPOINT}/modules`

const PERMISSIONS_ENDPOINT = `${ENDPOINT}/account/permissions`
const SETTINGS_ENDPOINT = `${ENDPOINT}/account/settings`
const MODULES_ENDPOINT = `${ENDPOINT}/modules`

export const endpoints = {
  logout: `${ENDPOINT}/logout`,
  profile: {
    index: `${ENDPOINT}/profile`,
  },
  groups: {
    index: `${PERMISSIONS_ENDPOINT}/groups`,
    create: `${PERMISSIONS_ENDPOINT}/groups/create`,
    update: `${PERMISSIONS_ENDPOINT}/groups/:uuid`
  },
  users: {
    index: `${PERMISSIONS_ENDPOINT}/users`,
    create: `${PERMISSIONS_ENDPOINT}/users/create`,
    update: `${PERMISSIONS_ENDPOINT}/users/:uuid`
  },
  apiUsers: {
    index: `${PERMISSIONS_ENDPOINT}/api-users`,
    create: `${PERMISSIONS_ENDPOINT}/api-users/create`,
    update: `${PERMISSIONS_ENDPOINT}/api-users/:uuid`,
  },
  modules: {
    index: `${MODULES_ENDPOINT}`,
  },
  account: {
    index: `${SETTINGS_ENDPOINT}/account`,
  },
}

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,
  groups: {
    index: `${API_PERMISSIONS_ENDPOINT}/groups`,
    create: `${API_PERMISSIONS_ENDPOINT}/groups/create`,
    update: `${API_PERMISSIONS_ENDPOINT}/groups/update`,
    fetch_by_uuid: `${API_PERMISSIONS_ENDPOINT}/groups/fetch-by-uuid`,
    metadata: `${API_PERMISSIONS_ENDPOINT}/groups/metadata`,
  },
  users: {
    index: `${API_PERMISSIONS_ENDPOINT}/users`,
    create: `${API_PERMISSIONS_ENDPOINT}/users/create`,
    update: `${API_PERMISSIONS_ENDPOINT}/users/update`,
    fetch_by_uuid: `${API_PERMISSIONS_ENDPOINT}/users/fetch-by-uuid`,
    metadata: `${API_PERMISSIONS_ENDPOINT}/users/metadata`,
  },
  apiUsers: {
    index: `${API_PERMISSIONS_ENDPOINT}/api-users`,
    create: `${API_PERMISSIONS_ENDPOINT}/api-users/create`,
    update: `${API_PERMISSIONS_ENDPOINT}/api-users/update`,
    fetch_by_uuid: `${API_PERMISSIONS_ENDPOINT}/api-users/fetch-by-uuid`,
    metadata: `${API_PERMISSIONS_ENDPOINT}/api-users/metadata`,
  },
  modules: {
    index: `${API_MODULES_ENDPOINT}/modules`,
  },
}
