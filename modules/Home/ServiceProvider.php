<?php declare(strict_types=1);

namespace Modules\Home;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Modules\Home\Module;

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
    function boot(Module $module) {
        $this->_register_routes($module);
        $this->_register_resources($module);
    }

    /**
     * Register module routes.
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
