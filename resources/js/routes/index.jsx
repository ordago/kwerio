import React from "react"

import Suspense from "../components/Suspense"

const Groups = React.lazy(() => import("../pages/Groups")),
  GroupsUpsert = React.lazy(() => import("../pages/Groups/Upsert")),
  Users = React.lazy(() => import("../pages/Users")),
  UsersUpsert = React.lazy(() => import("../pages/Users/Upsert")),
  ApiUsers = React.lazy(() => import("../pages/ApiUsers")),
  ApiUsersUpsert = React.lazy(() => import("../pages/ApiUsers/Upsert")),
  Profile = React.lazy(() => import("../pages/Profile"))

const API_ENDPOINT = '/api',
  ENDPOINT = ''

const ADMISSION_ENDPOINT = `${ENDPOINT}/lordland/admission`,
  API_ADMISSION_ENDPOINT = `${API_ENDPOINT}/lordland/admission`

export const endpoints = {
  logout: `${ENDPOINT}/logout`,

  profile: {
    index: `${ENDPOINT}/profile`,
  },

  lordland: {
    admission: {
      groups: {
        index: `${ADMISSION_ENDPOINT}/groups`,
        create: `${ADMISSION_ENDPOINT}/groups/create`,
        update: `${ADMISSION_ENDPOINT}/groups/:uuid`
      },
      users: {
        index: `${ADMISSION_ENDPOINT}/users`,
        create: `${ADMISSION_ENDPOINT}/users/create`,
        update: `${ADMISSION_ENDPOINT}/users/:uuid`
      },
      apiUsers: {
        index: `${ADMISSION_ENDPOINT}/api-users`,
        create: `${ADMISSION_ENDPOINT}/api-users/create`,
        update: `${ADMISSION_ENDPOINT}/api-users/:uuid`,
      },
    },
  },
}

export const api = {
  metadata: `${API_ENDPOINT}/metadata`,

  lordland: {
    admission: {
      groups: {
        index: `${API_ADMISSION_ENDPOINT}/groups`,
        create: `${API_ADMISSION_ENDPOINT}/groups/create`,
        update: `${API_ADMISSION_ENDPOINT}/groups/update`,
        fetch_by_uuid: `${API_ADMISSION_ENDPOINT}/groups/fetch-by-uuid`,
        delete: `${API_ADMISSION_ENDPOINT}/groups`,
        metadata: `${API_ADMISSION_ENDPOINT}/groups/metadata`,
      },
      users: {
        index: `${API_ADMISSION_ENDPOINT}/users`,
        create: `${API_ADMISSION_ENDPOINT}/users/create`,
        update: `${API_ADMISSION_ENDPOINT}/users/update`,
        fetch_by_uuid: `${API_ADMISSION_ENDPOINT}/users/fetch-by-uuid`,
        metadata: `${API_ADMISSION_ENDPOINT}/users/metadata`,
      },
      apiUsers: {
        index: `${API_ADMISSION_ENDPOINT}/api-users`,
        create: `${API_ADMISSION_ENDPOINT}/api-users/create`,
        update: `${API_ADMISSION_ENDPOINT}/api-users/update`,
        fetch_by_uuid: `${API_ADMISSION_ENDPOINT}/api-users/fetch-by-uuid`,
        metadata: `${API_ADMISSION_ENDPOINT}/api-users/metadata`,
      },
    },
  },
}

export const components = {
  /* LORDLAND / ADMISSION / GROUPS */
  [endpoints.lordland.admission.groups.create]: props => <Suspense component={<GroupsUpsert {...props} />} />,
  [endpoints.lordland.admission.groups.index]: props => <Suspense component={<Groups {...props} />} />,
  [endpoints.lordland.admission.groups.update]: props => <Suspense component={<GroupsUpsert {...props} />} />,

  /* LORDLAND / ADMISSION / USERS */
  [endpoints.lordland.admission.users.create]: props => <Suspense component={<UsersUpsert {...props} />} />,
  [endpoints.lordland.admission.users.update]: props => <Suspense component={<UsersUpsert {...props} />} />,
  [endpoints.lordland.admission.users.index]: props => <Suspense component={<Users {...props} />} />,

  /* LORDLAND / ADMISSION / API USERS */
  [endpoints.lordland.admission.apiUsers.index]: props => <Suspense component={<ApiUsers {...props} />} />,
  [endpoints.lordland.admission.apiUsers.create]: props => <Suspense component={<ApiUsersUpsert {...props} />} />,
  [endpoints.lordland.admission.apiUsers.update]: props => <Suspense component={<ApiUsersUpsert {...props} />} />,

  /* OTHERS */
  [endpoints.profile.index]: props => <Suspense component={<Profile {...props} />} />,
}
