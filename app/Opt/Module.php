<?php declare(strict_types=1);

namespace App\Opt;

use Illuminate\Support\Str;

class Module {
    /**
     * REQUIRED
     *
     * Module name used to display to end user.
     */
    public $name;

    /**
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
    public $position = PHP_INT_MAX;

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

        if (empty($this->uid)) { $this->uid = "module__" . Str::slug($this->name, "_"); }
        if (empty($this->slug)) { $this->slug = "/_/" . Str::slug($this->name); }
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

    /**
     * Get module configuration.
     *
     * @return mixed
     */
    function config(string $key) {
        return config("{$this->uid}.{$key}");
    }

    /**
     * Get module view name.
     *
     * @return View
     */
    function view(string $view) {
        return view($this->uid . "::{$view}");
    }
}
