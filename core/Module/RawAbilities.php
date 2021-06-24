<?php

namespace Kwerio\Module;

use Kwerio\Module\Base as BaseModule;
use Illuminate\Support\Fluent;
use Illuminate\Support\Arr;

class RawAbilities extends Fluent {
    /**
     * Initialize raw abilities.
     */
    public function __construct(BaseModule $module) {
        foreach ($module->config("abilities") ?? [] as $ability => $description) {
            list($name, $action) = explode("_", $ability, 2);

            $this->attributes[$name][] = $ability;
        }
    }

    /**
     * Merge the given abilities into a single array.
     */
    function merge($names = []) {
        $names = is_array($names) ? $names : func_get_args();
        $values = Arr::only($this->attributes, $names);

        return Arr::flatten($values);
    }
}
