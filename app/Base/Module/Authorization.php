<?php

namespace Kwerio\Module;

use Illuminate\Support\Facades\{
    Gate,
    Auth,
};

trait Authorization {
    /**
     * Authorize user action.
     *
     * @param string|null $action
     */
    function authorize(?string $action = null, $cannot_callback = null) {
        if (is_null($action)) {
            $action = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)[1]['function'];
        }

        if (Auth::user()->cannot("{$this->uid}/{$action}")) {
            if (!is_null($cannot_callback)) {
                $cannot_callback($action);
            } else {
                abort(403);
            }
        }
    }

    /**
     * Get gate name.
     *
     * @param string $name
     * @return string
     */
    function gate_name(string $name) {
        return "{$this->uid}/{$name}";
    }

    /**
     * Define new gate.
     *
     * @param string $name
     * @param mixed  $policy
     */
    function gate_define(string $name, $policy = null) {
        $name = $this->gate_name($name);

        if (is_null($policy)) {
            $policy = function(User $user) use($name) {
                return $user->has_ability($name);
            };
        }

        return Gate::define($this->gate_name($name), $policy);
    }
}
