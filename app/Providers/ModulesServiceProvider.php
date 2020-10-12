<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Finder\Finder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Arr;
use App\Base\Module\Loader;

class ModulesServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    function register() {
        $loader = resolve(Loader::class);
        $this->modules = $loader->load_from_disk();

        foreach ($this->modules as $module) {
            $this->app->register($module["service_provider"]);
        }
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    function boot() {
        Config::set("modules", $this->modules);

        foreach ($this->modules as $module) {
            Config::set($module["module"]->uid, $module["module"]);
        }
    }
}
