<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\SystemModels\Tenant;
use Illuminate\Support\Facades\{
    DB,
    Schema,
};

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
            $host = resolve("request")->getHost();

            if ($host === config("app.domain")) {
                return;
            }

            $name = explode(".", $host);

            match ($name) {
                "_system" => $this->_use_system(),
                default => Tenant::switch($name),
            };
        }
    }

    /**
     * Using system.
     */
    private function _use_system() {
        DB::purge("tenant");
        DB::reconnect("system");
        Schema::connection("system")->getConnection()->reconnect();
    }
}
