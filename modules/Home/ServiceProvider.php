<?php

namespace Modules\Home;

use Kwerio\Module\ServiceProvider as BaseServiceProvider;
use Modules\Home\Module;

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
