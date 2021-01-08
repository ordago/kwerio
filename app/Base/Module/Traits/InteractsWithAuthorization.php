<?php

namespace Kwerio\Module\Traits;

use Illuminate\Support\Facades\{
    Gate,
    Auth,
};

trait InteractsWithAuthorization {
    /**
     * Check if the user can perform any of the given actions.
     *
     * @param array $actions
     * @return bool
     */
    function can_any($actions) {
        $actions = is_array($actions) ? $actions : func_get_args();

        foreach ($actions as $action) {
            if ($this->can($action)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user can perform the given action inside this module.
     *
     * @param string $action
     * @return bool
     */
    function can(string $action) {
        return Auth::user()->can("{$this->uid}/{$action}");
    }

    /**
     * Authorize user action.
     *
     * @param string|null $action
     */
    function authorize(string $action = null, callable $cannot_callback = null) {
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
