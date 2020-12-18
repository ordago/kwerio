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
  accessTokens: {
    index: `${PERMISSIONS_ENDPOINT}/access-tokens`,
    create: `${PERMISSIONS_ENDPOINT}/access-tokens/create`,
    update: `${PERMISSIONS_ENDPOINT}/access-tokens/:uuid`,
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
    all: `${API_PERMISSIONS_ENDPOINT}/groups/all`,
  },
  users: {
    index: `${API_PERMISSIONS_ENDPOINT}/users`,
    create: `${API_PERMISSIONS_ENDPOINT}/users/create`,
    update: `${API_PERMISSIONS_ENDPOINT}/users/update`,
    fetch_by_uuid: `${API_PERMISSIONS_ENDPOINT}/users/fetch-by-uuid`,
    metadata: `${API_PERMISSIONS_ENDPOINT}/users/metadata`,
  },
  accessTokens: {
    index: `${API_PERMISSIONS_ENDPOINT}/access-tokens`,
    create: `${API_PERMISSIONS_ENDPOINT}/access-tokens/create`,
  },
  modules: {
    index: `${API_MODULES_ENDPOINT}/modules`,
    all: `${API_MODULES_ENDPOINT}/all`,
  },
}
