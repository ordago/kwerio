<?php

namespace Kwerio\Middleware;

use Closure;
use Illuminate\Http\Request;

class Access {
    /**
     * Authenticated user should be allowed to access to given group.
     *
     * @param Request $request
     * @param Closure
     * @param string $group
     */
    function handle(Request $request, Closure $next, ...$groups) {
        if ($request->user()->is_root()) {
            return $next($request);
        }

        if ($request->user()->member_of_either($groups)) {
            return $next($request);
        }

        abort(403);
    }
}
