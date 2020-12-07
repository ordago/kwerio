<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Finder\Finder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Arr;
use App\Base\Module\Loader;
use App\Models\Module;

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
        $modules = [];

        foreach ($this->modules as $module) {
            if (Module::whereUid($module["uid"])->exists()) {
                $inner = $module["module"];

                $modules[] = $item = [
                    "uid" => $inner->uid,
                    "name" => $inner->name,
                    "position" => $inner->position,
                    "slug" => $inner->slug,
                    "icon" => $inner->icon,
                    "hidden" => $inner->hidden,
                ];

                Config::set($inner->uid, $item);
            }
        }

        Config::set("modules", $modules);
    }
}
