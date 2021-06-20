<?php

namespace Kwerio\Middleware;

use App\Models\Module as ModuleModel;
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
    function handle(Request $request, Closure $next) {
        // Request should be made by an authenticated user.
        $user = $request->user();
        if (is_null($user)) abort(403);

        // Module must be loaded and accessible by the authenticated user.
        $module = resolve("module");
        if (is_null($module)) abort(404, "Failed to load module '{$module->uid}'");
        if (!$user->can_access_modules($module)) abort(403);

        // Module must be registered and not disabled on the database.
        $dbModule = ModuleModel::whereUid($module->uid)->first();
        if (is_null($dbModule)) abort(403, "Module '{$module->uid}' is available but not installed");

        // Non-Root users should not be allowed to access disabled modules.
        if ($user->is_root() || is_null($dbModule->disabled_at)) {
            return $next($request);
        }

        if ($module->disabled_at) abort(403, "Module '{$module->uid}' is disabled");

        abort(403);
    }
}
