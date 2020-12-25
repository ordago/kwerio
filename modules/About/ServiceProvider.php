<?php

namespace Modules\About;

use Kwerio\Module\ServiceProvider as BaseServiceProvider;
use Modules\About\Module;

class ServiceProvider extends BaseServiceProvider {
    /**
     * Register module.
     */
    function register() {
        $this->_register(resolve(Module::class));
    }

    /**
     * Boot module.
     */
    function boot(Module $module) {
        $this->_boot($module);
    }
}
