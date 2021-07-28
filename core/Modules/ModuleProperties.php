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
     * Get the tenant name that this module belongs to.
     */
    function tenant_uid() {
        if (is_null($this->subName)) return null;

        if (!is_null($this->moduleInstance->tenant)) {
            return $this->moduleInstance->tenant;
        }

        $tenant = preg_replace("/([A-Z])(.+?)/", "-$1$2", $this->name);

        return trim(strtolower($tenant), "-");
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
    function path() {
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
        return $this->path() . "/config/module.php";
    }
}
