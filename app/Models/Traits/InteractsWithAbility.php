<?php

namespace App\Models\Traits;

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
    function has_ability(string $ability) {
        return $this->has_abilities($ability);
    }

    /**
     * Check if the user has all the given abilities.
     *
     * @param string|array $abilities
     * @return bool
     */
    function has_abilities($abilities) {
        $abilities = is_array($abilities) ? $abilities : func_get_args();

        $acceptables = array_intersect(
            $this->abilities->pluck("name")->toArray(),
            $abilities
        );

        return count($abilities) === count($acceptables);
    }

    /**
     * Check if the user has one of the given abilities.
     *
     * @param string|array
     * @return bool
     */
    function has_either_abilities($abilities) {
        $abilities = is_array($abilities) ? $abilities : func_get_args();

        return (bool) array_intersect(
            $this->abilities->pluck("name")->toArray(),
            $abilities
        );
    }
}
