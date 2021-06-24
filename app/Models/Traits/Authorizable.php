<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\Access\Gate;

trait Authorizable {
    /**
     * Owner has access to all.
     *
     * @return bool
     */
    function is_owner() {
        return ! is_null($this->owner_at);
    }

    /**
     * Determine if the entity has the given abilities.
     *
     * @param  iterable|string  $abilities
     * @param  array|mixed  $arguments
     * @return bool
     */
    public function can($abilities, $arguments = [])
    {
        $abilities = $this->_prefix_abilities($abilities);

        return app(Gate::class)->forUser($this)->check($abilities, $arguments);
    }

    /**
     * Determine if the entity has any of the given abilities.
     *
     * @param  iterable|string  $abilities
     * @param  array|mixed  $arguments
     * @return bool
     */
    public function canAny($abilities, $arguments = [])
    {
        $abilities = $this->_prefix_abilities($abilities);

        return app(Gate::class)->forUser($this)->any($abilities, $arguments);
    }

    /**
     * Determine if the entity does not have the given abilities.
     *
     * @param  iterable|string  $abilities
     * @param  array|mixed  $arguments
     * @return bool
     */
    public function cant($abilities, $arguments = [])
    {
        return ! $this->can($abilities, $arguments);
    }

    /**
     * Determine if the entity does not have the given abilities.
     *
     * @param  iterable|string  $abilities
     * @param  array|mixed  $arguments
     * @return bool
     */
    public function cannot($abilities, $arguments = [])
    {
        return $this->cant($abilities, $arguments);
    }

    /**
     * Prefix abilities to properly map them to root or module.
     *
     * @param iterable|string $abilities
     * @return bool
     */
    private function _prefix_abilities($abilities) {
        $module = app()->has("module") ? resolve("module") : null;

        return collect($abilities)->map(function($ability) use($module) {
            if (! str_contains($ability, "/")) {
                return $module ? "{$module->uid}/{$ability}" : "root/{$ability}";
            }

            return $ability;
        });
    }

}
