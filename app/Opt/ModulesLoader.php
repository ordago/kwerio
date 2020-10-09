<?php declare(strict_types=1);

namespace App\Opt;

use Symfony\Component\Finder\Finder;
use Illuminate\Support\Arr;

class ModulesLoader {
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

        foreach ($finder as $dir) {
            $class = "Modules\\" . $dir->getBasename() . "\\Module";

            $module = [
                "basename" => $dir->getBasename(),
                "service_provider" => "Modules\\" . $dir->getBasename() . "\\ServiceProvider",
                "module" => new $class,
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

            $ins_idx = max($indexes);

            $this->_insert($modules, $module, $ins_idx + 1);
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
