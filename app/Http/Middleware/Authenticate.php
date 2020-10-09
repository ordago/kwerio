<?php

namespace App\Http\Middleware;

use Modules\BasicAuthentication\Module;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request) {
        $auth_module = resolve(Module::class);

        if (! $request->expectsJson()) {
            return $auth_module->route_prefix("/login");
        }
    }
}
