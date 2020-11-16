<?php

namespace App\Http\Middleware;

use Modules\Login\Module as LoginModule;
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
        $module = resolve(LoginModule::class);

        if (! $request->expectsJson()) {
            return $module->route_prefix("/");
        }
    }
}
