<?php

namespace Kwerio\Modules;

class ModuleProperties {
    private $name;
    private $subName;
    private $moduleInstance;
    private $baseClass;

    /**
     * Initialize Constructor.
     */
    function __construct($name, $subName = null) {
        $this->name = $name;
        $this->subName = $subName;

        $this->baseClass = $subName
            ? "Modules\\{$name}\\{$subName}\\Module"
            : "Modules\\{$name}\\Module";

        $this->moduleInstance = new $this->baseClass;
    }

    /**
     * Get an instance of the module.
     */
    function module_instance() {
        return new $this->baseClass;
    }

    /**
     * Get module base directory name.
     */
    function dir_basename() {
        return $this->subName
            ? base_path("modules/{$this->name}/{$this->subName}")
            : base_path("modules/{$this->name}");
    }

    /**
     * Get module service provider class.
     */
    function service_provider_class() {
        return $this->subName
            ? "Modules\\{$this->name}\\{$this->subName}\ServiceProvider"
            : "Modules\\{$this->name}\ServiceProvider";
    }

    /**
     * Get config path.
     */
    function config_path() {
        return $this->dir_basename() . "/config/module.php";
    }
}
