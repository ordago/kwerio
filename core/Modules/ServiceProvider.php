<?php

namespace Kwerio\Modules;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register service.
     */
    function register() {
        $this->app->alias(Modules::class, "modules");

        $this->app->scoped(Modules::class, function() {
            return new Modules();
        });
    }

    /**
     * Bootstrap service.
     */
    function boot() {
        $modules = resolve(Modules::class);
        $modules->init();
    }
}
