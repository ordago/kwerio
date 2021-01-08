<?php

namespace Kwerio\Module;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\{
    Gate,
    Auth,
};

abstract class Base {
    use Traits\InteractsWithAuthorization,
        Traits\InteractsWithView,
        Traits\InteractsWithRoute;

    /**
     * REQUIRED
     *
     * Module name used to display to end user.
     */
    public $name;

    /**
     * REQUIRED
     *
     * Module unique identifier (can not be duplicated).
     */
    public $uid;

    /**
     * Module icon (used in the menu).
     */
    public $icon = "widgets";

    /**
     * Module slug used in the url. (See route_prefix() on how to get full url)
     */
    public $slug;

    /**
     * Position of the module in the menu. default PHP_MAX_INT.
     */
    public $position = 9999;

    /**
     * The module should not be displayed to the end user. default false.
     */
    public $hidden = false;

    /**
     * Initialize constructor.
     */
    function __construct() {
        if (empty($this->name)) {
            throw new \Exception("Module name is required");
        }

        if (empty($this->uid)) $this->uid = Str::studly($this->name);
        if (empty($this->slug)) $this->slug = "/_/" . Str::slug($this->name);
    }

    /**
     * Set values dynamically on some properties.
     *
     * @param string $name
     * @return mixed
     */
    function __get($name) {
        if ($name === "path") {
            return base_path("modules/" . explode("\\", static::class)[1]);
        }

        return $this->{$name};
    }

    /**
     * Get table name.
     *
     * @return string
     */
    function table($name) {
        return "{$this->uid}__{$name}";
    }

    /**
     * Get module configuration.
     *
     * @return mixed
     */
    function config(string $key) {
        return config("{$this->uid}.{$key}");
    }
}
