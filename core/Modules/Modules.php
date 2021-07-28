<?php

namespace Kwerio\Modules;

use Illuminate\Support\Fluent;
use Illuminate\Http\Request;
use App\Models\Module as ModuleModel;
use App\SystemModels\Tenant;

class Modules extends Fluent {
    private $app;

    /**
     * Initialize modules.
     */
    function __construct($app) {
        $this->app = $app;

        $loader = new Loader;
        $modules = $loader->load_from_disk();

        foreach ($modules as $module) {
            $this->attributes[$module["uid"]] = $module;
        }
    }

    /**
     * Initialize modules.
     */
    function init() {
        $requested_module_slug = $this->_get_base_module_path_from_request();

        foreach ($this->attributes as $item) {
            if ($item["module"]->slug === $requested_module_slug) {
                $this->app->register($item["service_provider"]);
                $this->app->instance("module", $item["module"]);

                break;
            }
        }
    }

    /**
     * Get the modules that belongs to the given tenant.
     */
    function belongs_to_tenant(Tenant $tenant) {
        $modules = [];

        foreach ($this->attributes as $module) {
            if ($module["tenant_uid"] === $tenant->uid) {
                $modules[] = $module;
            }
        }

        return $modules;
    }

    /**
     * Get base module path from request.
     */
    private function _get_base_module_path_from_request() {
        $request = resolve(Request::class);

        return "/" . ltrim(join("/", array_slice(explode("/", $request->path()), 0, 2)), "/");
    }
}
