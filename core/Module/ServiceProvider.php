<?php

namespace Kwerio\Module;

use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Support\Facades\Route;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register module.
     */
    function _register($module) {
        $path = base_path("modules/{$module->uid}/config/module.php");
        $this->mergeConfigFrom($path, $module->uid);
    }

    /**
     * Boot module
     */
    function _boot($module) {
        $this->_register_abilities($module);
        $this->_register_routes($module);
        $this->_register_resources($module);
    }

    /**
     * Register module abilities.
     */
    function _register_abilities($module) {
        $abilities = $module->config("abilities") ?? [];

        foreach ($abilities as $ability => $description) {
            $ability = "{$module->uid}/{$ability}";

            Gate::define($ability, function($user) use($ability) {
                if ($user->is_owner()) {
                    return true;
                }

                return $user->isAbleTo($ability);
            });
        }
    }

    /**
     * Register resources.
     */
    function _register_resources($module) {
        $path = base_path("modules/{$module->uid}/resources/views");
        $this->loadViewsFrom($path, $module->uid);
    }

    /**
     * Register modules routes.
     */
    function _register_routes($module) {
        $path = "modules/{$module->uid}/routes";
        $middlewares = $module->config("router.middleware");

        $this->__register_web_routes($module, $path, $middlewares);
        $this->__register_api_routes($module, $path, $middlewares);
        $this->__register_webapi_routes($module, $path, $middlewares);
    }

    /**
     * Register web routes.
     */
    function __register_web_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/web.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth", "access.module"];

        Route::middleware(array_merge(["web"], $extra, $middlewares))
            ->prefix($module->config("router.prefix"))
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }

    /**
     * Register api routes.
     */
    function __register_api_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/api.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth:api", "access.module"];

        Route::middleware(array_merge(["api"], $extra, $middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }

    /**
     * Register web api routes.
     */
    function __register_webapi_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/webapi.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth:web,api", "access.module"];

        Route::middleware(array_merge(["webapi"], $extra, $middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }
}
