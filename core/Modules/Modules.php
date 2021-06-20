<?php

namespace Kwerio\Modules;

use Illuminate\Http\Request;
use App\Models\Module as ModuleModel;

class Modules {
    private $modules = [];
    private $app;

    /**
     * Initialize modules.
     */
    function __construct($app) {
        $this->app = $app;

        $loader = new Loader;
        $this->modules = $loader->load_from_disk();
    }

    /**
     * Initialize modules.
     */
    function init() {
        $requested_module_slug = $this->_get_base_module_path_from_request();

        foreach ($this->modules as $item) {
            if ($item["module"]->slug === $requested_module_slug) {
                $this->app->register($item["service_provider"]);
                $this->app->instance("module", $item["module"]);

                break;
            }
        }
    }

    /**
     * Get base module path from request.
     */
    private function _get_base_module_path_from_request() {
        $request = resolve(Request::class);

        return "/" . ltrim(join("/", array_slice(explode("/", $request->path()), 0, 2)), "/");
    }
}
