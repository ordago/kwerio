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

    /**
     * Check if user is a member of any of the given groups.
     *
     * @param string|array $groups
     * @return bool
     */
    function member_of($groups) {
        if ($this->is_owner()) {
            return true;
        }

        $groups = is_array($groups) ? $groups : func_get_args();

        return count($groups) === count(array_intersect(
            $this->groups->pluck("slug")->toArray(),
            $groups
        ));
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
