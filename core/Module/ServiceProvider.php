<?php

namespace Kwerio\Module;

use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Support\Facades\Route;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register module.
     */
    function _register($module) {
        $path = base_path("modules/{$module->uid}/config/module.php");
        $this->mergeConfigFrom($path, $module->uid);
    }

    /**
     * Boot module
     */
    function _boot($module) {
        $this->_register_abilities($module);
        $this->_register_resources($module);
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

    /**
     * Register resources.
     */
    function _register_resources($module) {
        $path = base_path("modules/{$module->uid}/resources/views");
        $this->loadViewsFrom($path, $module->uid);
    }
}
