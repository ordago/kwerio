<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Ability;
use Illuminate\Support\{
    Arr,
    Str,
};

trait InteractsWithAbility {
    /**
     * Get abilities.
     *
     * @return MorphToMany
     */
    function abilities() {
        return $this->belongsToMany(Ability::class)
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
     * Check if user has all the given abilities.
     *
     * @retun boolean
     */
    function is_able_to(...$abilities) {
        return $this->isAbleTo($abilities);
    }

    /**
     * @deprecated
     * Check if the user has all the given abilities.
     *
     * @param string|array $abilities
     * @return bool
     */
    function isAbleTo(...$abilities) {
        $names = (array) $this->abilities->pluck("name")->toArray();
        $matches = array_intersect($names, $abilities);

        return count($matches) === count($abilities);
    }
}
