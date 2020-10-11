<?php declare(strict_types=1);

namespace App\Base\Module;

use App\Models\Module as ModuleModel;
use Symfony\Component\Finder\Finder;
use Illuminate\Support\Arr;
use App\Base\Module\Base as Module;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;

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
        $models = $this->_load_models();

        // Load all modules from database. if modules table does not exists,
        // then return an empty array.
        if (empty($models)) return [];

        // Load modules by the default order:
        foreach ($finder as $dir) {
            $class = "Modules\\" . $dir->getBasename() . "\\Module";
            $moduleInstance = new $class;

            if (in_array($moduleInstance->uid, $uids)) {
                throw new \Exception("A module already exists with uid: {$moduleInstance->uid}");
            }

            $model = $this->_can_load($models, $moduleInstance);
            if (empty($model)) continue;

            $moduleInstance->overwrite_from_model($model);
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
     * Check if module can be loaded.
     *
     * @param Module $module
     * @return bool
     */
    private function _can_load($models, Module $module) {
        return $models->where("uid", $module->uid)->first();
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

    /**
     * Load models from database.
     *
     * @return array
     * @throws \Exception
     */
    private function _load_models() {
        try {
            return ModuleModel::all();
        } catch (QueryException $e) {
            if (Str::contains($e->getMessage(), ["no such table", "modules"])) {
                return [];
            }

            throw $e;
        }
    }
}
