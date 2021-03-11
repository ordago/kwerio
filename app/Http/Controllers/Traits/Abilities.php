<?php

namespace App\Http\Controllers\Traits;

trait Abilities {
    /**
     * Prefix the given abilities with module name.
     *
     * @return array
     */
    protected function prefix_abilities(...$abilities) {
        $request = request();
        $prefix = "root";

        if ($request->filled("module")) {
            $prefix = $request->get("module");
        }

        return array_map(function($ability) use($prefix) {
            if (!strpos($ability, "/")) {
                return "{$prefix}/{$ability}";
            }

            return $ability;
        }, $abilities);
    }
}
