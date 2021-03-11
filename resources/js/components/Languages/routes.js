const API = "/api/components/languages"

export default {
    index: API,
    create: `${API}/create`,
    update: `${API}/:uuid`,
    fetch_by_uuid: `${API}/fetch-by-uuid`,
    delete: API,
    duplicate: `${API}/duplicate`,
    set_as_default: `${API}/set-as-default`,
}
