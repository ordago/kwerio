<?php

namespace Kwerio\Middleware;

use Illuminate\Support\Facades\Config;
use Closure;
use Illuminate\Http\Request;

class AccessModule {
    /**
     * Authorize user access to given module/admin area.
     *
     * @param Request $request
     * @param Closure
     * @param string $group
     */
    function handle(Request $request, Closure $next, $module) {
        $user = $request->user();

        if (!is_null($module) && $user->can_access_modules($module)) {
            Config::set("module", $module);
            return $next($request);
        }

        if ($user->is_root()) {
            return $next($request);
        }

        abort(403);
    }
}
