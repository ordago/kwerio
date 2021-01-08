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
     *
     * @param Module $module
     */
    function _register_abilities($module) {
        $abilities = $module->config("abilities");

        foreach ($abilities as $ability => $description) {
            Gate::define("{$module->uid}/{$ability}", function($user) use($ability) {
                return $user->has_ability($ability);
            });
        }
    }

    /**
     * Register resources.
     *
     * @param Module $module
     */
    function _register_resources($module) {
        $path = base_path("modules/{$module->uid}/resources/views");
        $this->loadViewsFrom($path, $module->uid);
    }

    /**
     * Register modules routes.
     *
     * @param Module $module
     */
    function _register_routes($module) {
        $path = "modules/{$module->uid}/routes";
        $default_middlewares = $module->config("router.middleware");

        Route::middleware(array_merge(["web"], $default_middlewares))
            ->prefix($module->config("router.prefix"))
            ->namespace($module->config("router.namespace"))
            ->group(base_path("{$path}/web.php"));

        Route::middleware(array_merge(["webapi"], $default_middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group(base_path("{$path}/webapi.php"));

        Route::middleware(array_merge(["api"], $default_middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group(base_path("{$path}/api.php"));
    }
}
