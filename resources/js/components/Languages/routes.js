const API = "/api/components/languages"

export default {
    create: `${API}/create`,
    delete: API,
    disable: `${API}/disable`,
    duplicate: `${API}/duplicate`,
    fetch_by_uuid: `${API}/fetch-by-uuid`,
    index: API,
    metadata: `${API}/metadata`,
    set_as_default: `${API}/set-as-default`,
    update: `${API}/:uuid`,
}
