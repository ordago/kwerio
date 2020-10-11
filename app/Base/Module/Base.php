<?php declare(strict_types=1);

namespace App\Base\Module;

use Illuminate\Support\Str;
use App\Models\Module as ModuleModel;

abstract class Base {
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
     * ModuleModel instance.
     *
     * @var ModuleModel
     */
    public $model;

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
     * Overwrite the default property values, by the one provided by the model.
     *
     * @param ModuleModel $model
     */
    function overwrite_from_model(ModuleModel $model) {
        $this->model = $model;

        $this->name = $model->name;
        $this->uid = $model->uid;
        $this->slug = $model->slug;
        $this->icon = $model->icon;
        $this->position = $model->position;
        $this->hidden = $model->hidden;
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
