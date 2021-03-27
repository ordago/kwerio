const API = "/api/components/fieldsets"

export default {
    create: `${API}/create`,
    delete: API,
    disable: `${API}/disable`,
    duplicate: `${API}/duplicate`,
    fetch_by_uuid: `${API}/fetch-by-uuid`,
    index: API,
    metadata: `${API}/metadata`,
    update: `${API}/:uuid`,
}
