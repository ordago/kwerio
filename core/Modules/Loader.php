<?php

namespace Kwerio\Modules;

use Symfony\Component\Finder\Finder;
use Illuminate\Support\Arr;
use Kwerio\Module\Base as Module;

class Loader {
    /**
     * Load modules from disk.
     *
     * @return array
     */
    function load_from_disk() {
        $finder = (new Finder)
            ->in(base_path("modules"))
            ->directories()
            ->depth(0);

        $shadow = [];
        $modules = [];
        $uids = [];

        // Load modules by the default order:
        foreach ($finder as $dir) {
            $properties = $this->_try_resolve_tenant_modules($dir);

            foreach ($properties as $prop) {
                $moduleInstance = $prop->module_instance();

                if (in_array($moduleInstance->uid, $uids)) {
                    throw new \Exception("A module already exists with uid: {$moduleInstance->uid}");
                }

                $uids[] = $moduleInstance->uid;

                $moduleInstance->path = $prop->path();
                $moduleInstance->tenant_uid = $prop->tenant_uid();
                $moduleInstance->service_provider = $prop->service_provider_class();
                $moduleInstance->config = require $prop->config_path();

                $shadow[$moduleInstance->uid] = $moduleInstance;
            }
        }

        // Sort modules based on dependencies
        $in = [];

        foreach ($shadow as $_ => $module) {
            $this->_walk($shadow, $modules, $module, $in);
        }

        return $modules;
    }

    /**
     * Walk the graph to resolve dependencies in the right order.
     *
     * @param array  $shadow
     * @param array  $modules
     * @param array  $module
     * @param array  $in
     * @param array  $seen
     * @throws Exception
     */
    private function _walk($shadow, &$modules, $module, &$in, $seen = []) {
        foreach (Arr::wrap($module->config["depends_on"]) as $dep) {
            if (in_array($dep, $in)) {
                continue;
            }

            if (in_array($dep, $seen)) {
                throw new \Exception("Module {$module->uid} is cyclic");
            }

            $seen[] = $dep;

            $this->_walk($shadow, $modules, $shadow[$dep], $in, $seen);
        }

        if (!in_array($module->uid, $in)) {
            $modules[] = $module;
            $in[] = $module->uid;
        }
    }

    /**
     * Resolve module / tenant classes.
     */
    private function _try_resolve_tenant_modules($dir) {
        $classes = [];
        $dir = $dir->getBasename();
        $path = base_path("modules/{$dir}");

        if (file_exists("{$path}/Module.php")) {
            return [new ModuleProperties($dir)];
        }

        $classes = [];

        foreach (glob("{$path}/*") as $module) {
            if (file_exists("{$module}/Module.php")) {
                preg_match("/.+\/(.+)$/", $module, $m);
                $classes[] = new ModuleProperties($dir, $m[1]);
            }
        }

        return $classes;
    }
}
