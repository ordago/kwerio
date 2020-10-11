<?php declare(strict_types=1);

namespace App\Base\Module;

use Symfony\Component\Finder\Finder;
use Illuminate\Support\Arr;

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

            $shadow[] = $module;
            $modules[] = $module;
        }

        foreach ($shadow as $module) {
            if (!isset($module["config"]["depends_on"])) {
                $this->_insert($modules, $module, 0);
                continue;
            }

            $indexes = [];
            $ins_idx = null;

            foreach ($module["config"]["depends_on"] as $dep) {
                foreach ($modules as $i => $mod) {
                    if ($mod["basename"] === $module["basename"]) {
                        $ins_idx = $i;
                    }

                    if ($mod["basename"] === $dep) {
                        $indexes[] = $i;
                    }
                }
            }

            if (empty($indexes)) {
                $this->_insert($modules, $module, 0);
            } else {
                $this->_insert($modules, $module, max($indexes) + 1);
            }
        }

        return $modules;
    }

    private function _insert(&$modules, $module, $idx) {
        foreach ($modules as $i => $m) {
            if ($m["basename"] === $module["basename"]) {
                unset($modules[$i]);
                array_splice($modules, $idx, 0, [$module]);
                break;
            }
        }
    }
}
