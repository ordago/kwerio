<?php

namespace Kwerio\Modules;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register service.
     */
    function register() {
        $this->app->scoped(Modules::class, function($app) {
            return new Modules($app);
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
