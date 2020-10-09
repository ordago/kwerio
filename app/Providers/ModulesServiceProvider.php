<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Finder\Finder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Arr;
use App\Opt\ModulesLoader;

class ModulesServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    function register() {
        $modulesLoader = resolve(ModulesLoader::class);
        $this->modules = $modulesLoader->load_from_disk();

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
