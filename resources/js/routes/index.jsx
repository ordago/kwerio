import React from "react"

import Suspense from "../components/Suspense"

const Groups = React.lazy(() => import("../pages/Groups")),
  GroupsUpsert = React.lazy(() => import("../pages/Groups/Upsert")),
  Users = React.lazy(() => import("../pages/Users")),
  UsersUpsert = React.lazy(() => import("../pages/Users/Upsert")),
  ApiUsers = React.lazy(() => import("../pages/ApiUsers")),
  ApiUsersUpsert = React.lazy(() => import("../pages/ApiUsers/Upsert")),
  Account = React.lazy(() => import("../pages/Account")),
  Profile = React.lazy(() => import("../pages/Profile"))

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
}

export const components = {
  /* ACCOUNT / PERMISSIONS / GROUPS */
  [endpoints.groups.create]: props => <Suspense component={<GroupsUpsert {...props} />} />,
  [endpoints.groups.index]: props => <Suspense component={<Groups {...props} />} />,
  [endpoints.groups.update]: props => <Suspense component={<GroupsUpsert {...props} />} />,

  /* ACCOUNT / PERMISSIONS / USERS */
  [endpoints.users.create]: props => <Suspense component={<UsersUpsert {...props} />} />,
  [endpoints.users.update]: props => <Suspense component={<UsersUpsert {...props} />} />,
  [endpoints.users.index]: props => <Suspense component={<Users {...props} />} />,

  /* ACCOUNT / PERMISSIONS / API USERS */
  [endpoints.apiUsers.index]: props => <Suspense component={<ApiUsers {...props} />} />,
  [endpoints.apiUsers.create]: props => <Suspense component={<ApiUsersUpsert {...props} />} />,
  [endpoints.apiUsers.update]: props => <Suspense component={<ApiUsersUpsert {...props} />} />,

  /* OTHERS */
  [endpoints.profile.index]: props => <Suspense component={<Profile {...props} />} />,
}
