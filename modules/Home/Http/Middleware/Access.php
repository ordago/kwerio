<?php

namespace Modules\Home\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Home\Module;

class Access
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $module = resolve(Module::class);
        $user = $request->user();

        if ($user->is_owner()) {
            return $next($request);
        }

        if ($user->can_access_module($module->uid)) {
            return $next($request);
        }

        abort(403);
    }
}
