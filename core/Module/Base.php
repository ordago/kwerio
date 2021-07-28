<?php

namespace Kwerio\Module;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

abstract class Base {
    use Traits\InteractsWithView,
        Traits\InteractsWithRoute,
        Traits\Initialize;

    /**
     * Module configuration.
     */
    public array $config;

    /**
     * ServiceProvider class of the module.
     */
    public string $service_provider;

    /**
     * Full path to the module.
     */
    public string $path;

    /**
     * The tenant_uid that this module should be loaded into. (empty: all)
     */
    public $tenant_uid;

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
     * Only authorized users can use the module.
     */
    public $auth = true;

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
        if ($this->tenant_uid) return $name;

        return "{$this->uid}__{$name}";
    }

    /**
     * Get module configuration.
     *
     * @return mixed
     */
    function config(string $key = null) {
        if (!$key) {
            return config("{$this->uid}");
        }

        return config("{$this->uid}.{$key}");
    }

    function abilities() {
        return new RawAbilities($this);
    }
}
