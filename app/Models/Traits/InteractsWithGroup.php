<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Group;

trait InteractsWithGroup {
    /**
     * Get user groups.
     *
     * @return BelongsToMany
     */
    function groups() {
        return $this->morphToMany(Group::class, "groupable");
    }

    /**
     * Check if user is root.
     *
     * @return bool
     */
    function is_root() {
        return $this->member_of("root");
    }

    function member_of($groups) {
        $groups = is_array($groups) ? $groups : func_get_args();

        return count($groups) === count(array_intersect(
            $this->groups->pluck("slug")->toArray(),
            $groups
        ));
    }

    /**
     * Check if user member either one of the given groups.
     *
     * @param string|array
     * @return bool
     */
    function member_of_either($groups) {
        $groups = is_array($groups) ? $groups : func_get_args();

        return (bool) array_intersect(
            $this->groups->pluck("slug")->toArray(),
            $groups
        );
    }

    /**
     * Get uuids of the groups that this user belongs to.
     *
     * @return array
     */
    function get_groups_uuids() {
        return $this->groups->pluck("uuid");
    }
}
