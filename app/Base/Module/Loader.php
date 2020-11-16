<?php declare(strict_types=1);

namespace App\Base\Module;

use Symfony\Component\Finder\Finder;
use Illuminate\Support\Arr;
use App\Base\Module\Base as Module;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
            $class = "Modules\\" . $dir->getBasename() . "\\Module";
            $moduleInstance = new $class;

            if (in_array($moduleInstance->uid, $uids)) {
                throw new \Exception("A module already exists with uid: {$moduleInstance->uid}");
            }

            $uids[] = $moduleInstance->uid;

            $module = [
                "basename" => $dir->getBasename(),
                "service_provider" => "Modules\\" . $dir->getBasename() . "\\ServiceProvider",
                "module" => $moduleInstance,
                "uid" => $moduleInstance->uid,
                "config" => require $dir->getPathname() . "/config/module.php",
            ];

            $shadow[$module["basename"]] = $module;
        }

        // Sort modules based on dependencies
        $in = [];

        foreach ($shadow as $basename => $module) {
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
        foreach (Arr::wrap($module["config"]["depends_on"]) as $dep) {
            if (in_array($dep, $in)) {
                continue;
            }

            if (in_array($dep, $seen)) {
                throw new \Exception("Module {$module['basename']} is cyclic");
            }

            $seen[] = $dep;

            $this->_walk($shadow, $modules, $shadow[$dep], $in, $seen);
        }

        if (!in_array($module["basename"], $in)) {
            $modules[] = $module;
            $in[] = $module["basename"];
        }
    }

    /**
     * Add to the list of modules to be loaded.
     *
     * @param array   $modules
     * @param Module  $module
     * @param integer $idx
     */
    private function _add(&$modules, $module, $idx) {
        foreach ($modules as $i => $m) {
            if ($m["basename"] === $module["basename"]) {
                unset($modules[$i]);
                array_splice($modules, $idx, 0, [$module]);
                break;
            }
        }
    }
}
