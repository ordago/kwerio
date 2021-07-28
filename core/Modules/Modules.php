<?php

namespace Kwerio\Modules;

use Illuminate\Support\Fluent;
use Illuminate\Http\Request;
use App\Models\Module as ModuleModel;
use App\SystemModels\Tenant;
use Kwerio\Module\Base as BaseModule;

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
            $this->attributes[$module->uid] = $module;
        }
    }

    /**
     * Initialize modules.
     */
    function init() {
        $requested_module_slug = $this->_get_base_module_path_from_request();

        foreach ($this->attributes as $module) {
            if ($module->slug === $requested_module_slug) {
                $this->_register_module($module);
                break;
            }
        }
    }

    /**
     * Get modules that are installed.
     */
    function authorized() {
        $modules = [];
        $_modules = [];
        $user = request()->user();
        $activeModules = ModuleModel::get(["uid", "uuid"])
            ->whereNull("disabled_at");

        foreach ($activeModules as $active) {
            $module = $this->get($active->uid);

            if ($module && $user->can_access_modules($module)) {
                $module->uuid = $active->uuid;
                $modules[] = $module;
            }
        }

        return $modules;
    }

    /**
     * Get the modules that belongs to the given tenant.
     */
    function built_for_tenant(Tenant $tenant) {
        $modules = [];

        foreach ($this->attributes as $module) {
            if ($module->tenant_uid === $tenant->uid) {
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

    /**
     * Register module and its dependencies.
     */
    private function _register_module($module) {
        $deps = [];
        $this->_resolve_dependencies($module, $deps);
        $deps = array_unique($deps);

        // Attributes contains modules in order of dependencies, so we can
        // simply loop it, and dependent modules will be registered in the
        // right order.
        foreach ($this->attributes as $candidate) {
            if (in_array($candidate->uid, $deps)) {
                $this->app->register($candidate->service_provider);
                $this->app->instance($candidate->uid, $candidate);
            }
        }

        // Register the current module.
        $this->app->register($module->service_provider);
        $this->app->instance($module->uid, $module);
        $this->app->instance("module", $module);
    }

    /**
     * Find all modules recursivly that this module depends on.
     */
    private function _resolve_dependencies($module, &$deps) {
        foreach ($module->config["depends_on"] as $dep) {
            $deps[] = $dep;
            $dep_module = $this->get($dep);
            $this->_resolve_dependencies($dep_module, $deps);
        }
    }
}
