<?php

namespace Modules\About\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\About\Module;

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

        if ($user->can_access_module($module->uid)) {
            return $next($request);
        }

        abort(403);
    }
}
