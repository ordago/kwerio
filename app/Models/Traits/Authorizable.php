<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\Access\Gate;

trait Authorizable {
    /**
     * Prefix abilities to properly map them to root or module.
     *
     * @param iterable|string $abilities
     * @return bool
     */
    private function _prefix_abilities($abilities) {
        $module = config("module");

        return collect($abilities)->map(function($ability) use($module) {
            if (
                is_null($module)
                || Str::startsWith($ability, "root/")
                || Str::contains($ability, "/")
            ) {
                return $ability;
            }

            return "{$module}/{$ability}";
        });
    }

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
}
