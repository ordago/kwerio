<?php

namespace Kwerio\Module;

use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Support\Facades\Route;
use ReflectionClass;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register module.
     */
    function register() {
        $uid = resolve(str_replace("ServiceProvider", "Module", static::class))->uid;
        $module = resolve("modules")->get($uid);

        $this->mergeConfigFrom("{$module->path}/config/module.php", $uid);
    }

    /**
     * Boot module
     */
    function boot() {
        $module = resolve("module");

        $this->_register_abilities($module);
        $this->_register_routes($module);

        $this->loadViewsFrom("{$module->path}/resources/views", $module->uid);
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

    function _register_routes($module) {
        $domain = config("app.domain");

        Route::domain("{tenant}.{$domain}")->group(function() use($module) {
            $path = "{$module->path}/routes";
            $middlewares = $module->config("router.middleware");

            $this->__register_web_routes($module, "{$path}/web.php", $middlewares);
            $this->__register_api_routes($module, "{$path}/api.php", $middlewares);
            $this->__register_webapi_routes($module, "{$path}/webapi.php", $middlewares);
        });
    }

    /**
     * Register web routes.
     */
    private function __register_web_routes($module, $path, $middlewares) {
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
    private function __register_api_routes($module, $path, $middlewares) {
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
    private function __register_webapi_routes($module, $path, $middlewares) {
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth:web,api", "access.module"];

        Route::middleware(array_merge(["webapi"], $extra, $middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }
}
