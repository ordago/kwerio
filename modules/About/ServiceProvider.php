<?php

namespace Modules\About;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Modules\About\Module;
use Modules\About\Http\Middleware\Access;
use Illuminate\Routing\Router;
use Modules\About\Policies\{
    ViewPolicy,
};

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register module.
     */
    function register() {
        $module = resolve(Module::class);

        $this->mergeConfigFrom(__DIR__ . "/config/module.php", $module->uid);
    }

    /**
     * Boot module.
     */
    function boot(Router $router, Module $module) {
        $router->aliasMiddleware("access_About", Access::class);

        $this->_register_routes($module);
        $this->_register_resources($module);
    }

    /**
     * Register module routes.
     *
     * @param Module $module
     */
    function _register_routes(Module $module) {
        Route::group([
            "prefix" => $module->config("router.prefix"),
            "namespace" => $module->config("router.namespace"),
            "middleware" => $module->config("router.middleware"),
        ], function() {
            $this->loadRoutesFrom(__DIR__ . "/routes/web.php");
        });
    }

    /**
     * Register module resources.
     */
    function _register_resources(Module $module) {
        $this->loadViewsFrom(__DIR__ . "/resources/views", $module->uid);
    }
}
