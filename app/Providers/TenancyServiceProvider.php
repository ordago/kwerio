<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\SystemModels\Tenant;

class TenancyServiceProvider extends ServiceProvider {
    /**
     * Register services.
     */
    public function register() {

    }

    /**
     * Bootstrap services.
     */
    public function boot() {
        if (!$this->app->runningInConsole()) {
            Tenant::switch(
                explode(".", resolve("request")->getHost())[0]
            );
        }
    }
}
