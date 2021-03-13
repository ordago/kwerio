<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\{
    User,
    Userable,
};

trait UserActionLogger {
    /**
     * Log user action.
     *
     * @param string $action
     */
    function log_user_action($action, $meta = null) {
        $user = Auth::user();

        Userable::create([
            "uuid" => Str::uuid(),
            "user_id" => $user->id,
            "user_email" => @$user->email,
            "user_model" => get_class($user),
            "user_type" => ($user instanceof User) ? "web" : "api",
            "userable_type" => get_class($this),
            "userable_id" => $this->id,
            "action" => $action,
            "meta" => serialize($meta),
            "created_at" => now(),
        ]);
    }
}
