<?php

namespace App\Models\Traits;

use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Collection;
use App\Models\{
    Ability,
};

trait InteractsWithAbility {
    /**
     * Get abilities.
     *
     * @return MorphToMany
     */
    function abilities() {
        return $this->morphToMany(Ability::class, "abilitable")
            ->withTimestamps();
    }

    /**
     * Get abilities names.
     *
     * @return array
     */
    function get_abilities_names() {
        return $this->abilities->pluck("name");
    }

    /**
     * Check if it has the given ability.
     *
     * @param string $ability
     * @return bool
     */
    function has_ability(string $ability, $module_uid = null) {
        return $this->has_abilities($ability, $module_uid);
    }

    /**
     * Check if the user has all the given abilities.
     *
     * @param string|array $abilities
     * @return bool
     */
    function has_abilities($abilities, $module_uid = null) {
        $abilities = Arr::wrap($abilities);

        if (is_null($module_uid)) {
            $acceptables = array_intersect(
                $this->abilities->pluck("name")->toArray(),
                $abilities
            );

            return count($abilities) === count($acceptables);
        }

        foreach ($abilities as $name) {
            $ability = $this->abilities->where("name", $name)->first();
            if (is_null($ability)) return false;

            $module = $ability->module->where("uid", $module_uid)->first();
            if (is_null($module)) return false;
        }

        return true;
    }
}
