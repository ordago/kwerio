<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Module;

trait InteractsWithModule {
    /**
     * Get modules that user can access.
     *
     * @return BelongsToManyThrough
     */
    function modules() {
        return new Collection($this->groups->map(function($group) {
            return $group->modules;
        })->flatten());
    }

    /**
     * Check if user is allowed to access to given module(s).
     *
     * @param array|string $module
     * @return bool
     */
    function can_access_either_modules($modules) {
        if ($this->is_root()) {
            return true;
        }

        $modules = is_array($modules) ? $modules : func_get_args();

        return (bool) array_intersect(
            $this->modules()->pluck("uuid")->toArray(),
            $modules
        );
    }

    /**
     * Check if user can access all the given modules.
     *
     * @param string|array $modules
     * @return bool
     */
    function can_access_modules($modules) {
        if ($this->is_root()) {
            return true;
        }

        $modules = is_array($modules) ? $modules : func_get_args();
        $accessable = array_intersect(
            $this->modules()->pluck("uuid")->toArray(),
            $modules
        );

        return count($modules) === count($accessable);
    }

    /**
     * Get all user modules uuids.
     *
     * @return array
     */
    function get_modules_uuids() {
        return $this->modules()->pluck("uuid")->toArray();
    }
}
