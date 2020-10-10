<?php declare(strict_types=1);

namespace App\Opt;

use Illuminate\Support\Str;

class Module {
    public $name;
    public $slug;
    public $uid;

    function __construct() {
        if (empty($this->name)) {
            throw new \Exception("Module name is required");
        }

        if (empty($this->uid)) {
            $this->uid = "module__" . Str::slug($this->name, "_");
        }

        if (empty($this->uid)) {
            $this->slug = Str::slug($this->name);
        }
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

        return "/_/{$this->slug}{$append}";
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
