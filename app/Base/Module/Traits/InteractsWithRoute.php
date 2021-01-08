<?php

namespace Kwerio\Module\Traits;

trait InteractsWithRoute {
    /**
     * @see route_prefix
     */
    function route($append = "") {
        return $this->route_prefix($append);
    }

    /**
     * Get a prefixed route for the given module.
     *
     * @return string
     */
    function route_prefix($append = "") {
        $append = ltrim($append, "/");
        $append = empty($append) ? "" : "/{$append}";

        return "{$this->slug}{$append}";
    }

    /**
     * Get route name.
     *
     * @param string $name
     * @return string
     */
    function route_name($name) {
        return "{$this->uid}.{$name}";
    }
}
