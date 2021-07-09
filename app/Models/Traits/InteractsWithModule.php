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
     * Check if user can access all the given modules.
     *
     * @param string|array $modules
     * @return bool
     */
    function can_access_modules($modules) {
        if ($this->is_root() || $this->is_owner()) {
            return true;
        }

        $modules = collect(is_array($modules) ? $modules : func_get_args())->pluck("uid");

        $accessable = array_unique(array_intersect(
            $this->modules()->pluck("uid")->toArray(),
            $modules->toArray()
        ));

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
