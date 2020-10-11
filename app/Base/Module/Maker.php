<?php declare(strict_types=1);

namespace App\Base\Module;

use Symfony\Component\Finder\Finder;
use SplFileInfo;
use App\Models\Module as ModuleModel;
use Illuminate\Support\{
    Arr,
    Str,
};

class Maker {
    private $middlewares = '["web"]';

    /**
     * Add the modules that are not yet added to database.
     *
     * @return Collection
     *   The modules that are added.
     */
    function sync() {
        $finder = (new Finder)
            ->in(base_path("modules"))
            ->directories()
            ->depth(0);

        $models = collect();

        foreach ($finder as $file) {
            $class = "Modules\\" . $file->getBasename() . "\Module";
            $module = new $class;

            if (! ModuleModel::whereUid($module->uid)->exists()) {
                $models[] = $this->create_from_path($file->getPathname());
            }
        }

        return $models;
    }

    /**
     * Create new module from the given path.
     *
     * @param string $path
     * @return Model
     */
    function create_from_path(string $path) {
        if (file_exists($path)) {
            $path = new SplFileInfo($path);
        } else if (file_exists(base_path($path))) {
            $path = new SplFileInfo(base_path($path));
        } else if (file_exists(base_path("modules/{$path}"))) {
            $path = new SplFileInfo(base_path("modules/{$path}"));
        } else {
            throw new \Exception("Module {$path} not found.");
        }

        $class = "Modules\\" . $path->getBasename() . "\Module";

        return $this->_create(new $class);
    }

    /**
     * Make new module and persist it to database.
     *
     * @param string $name
     * @return Model
     */
    function create(string $name) {
        $module = $this->make($name);

        return $this->_create($module);
    }

    /**
     * Persist the given module to the database.
     *
     * @param Module $module
     * @return ModuleModel
     */
    private function _create($module) {
        return ModuleModel::create([
            "name" => $module->name,
            "uid" => $module->uid,
            "slug" => $module->slug,
            "icon" => $module->icon,
            "position" => $module->position,
            "hidden" => $module->hidden,
        ]);
    }

    /**
     * Make new module without installing it to database.
     *
     * @param string $name
     * @return Module
     */
    function make(string $name) {
        $uid = "module__" . Str::slug($name, "_");
        $dir = Str::studly($name);
        $path = base_path("modules/{$dir}");
        $slug = Str::slug($name);

        if (file_exists($path)) {
            throw new \Exception("Path {$path} already exists");
        }

        // Generate config file
        $config = file_get_contents(__DIR__ . "/stubs/config");
        $config = str_replace("%NS%", $dir, $config);
        $config = str_replace("%MIDDLEWARES%", $this->middlewares, $config);

        mkdir("{$path}/config", 0755, true);
        file_put_contents("{$path}/config/module.php", $config);

        // Generate module file
        $module = file_get_contents(__DIR__ . "/stubs/module");
        $module = str_replace("%NS%", $dir, $module);
        $module = str_replace("%NAME%", $name, $module);
        $module = str_replace("%UID%", $uid, $module);

        file_put_contents("{$path}/Module.php", $module);

        // Generate service provider
        $service_provider = file_get_contents(__DIR__ . "/stubs/service_provider");
        $service_provider = str_replace("%NS%", $dir, $service_provider);

        file_put_contents("{$path}/ServiceProvider.php", $service_provider);

        // Generate routes web
        $web = file_get_contents(__DIR__ . "/stubs/web");
        $web = str_replace("%NS%", $dir, $web);

        mkdir("{$path}/routes", 0755);
        file_put_contents("{$path}/routes/web.php", $web);

        // Generate controller
        $controller = file_get_contents(__DIR__ . "/stubs/controller");
        $controller = str_replace("%NS%", $dir, $controller);

        mkdir("{$path}/Http/Controllers", 0755, true);
        file_put_contents("{$path}/Http/Controllers/Controller.php", $controller);

        // Generate view
        $view = file_get_contents(__DIR__ . "/stubs/view");
        $view = str_replace("%SLUG%", $slug, $view);

        mkdir("{$path}/resources/views", 0755, true);
        file_put_contents("{$path}/resources/views/index.blade.php", $view);

        // Generate jsx
        $jsx = file_get_contents(__DIR__ . "/stubs/jsx");
        $jsx = str_replace("%NAME%", $name, $jsx);

        mkdir("{$path}/resources/js", 0755);
        file_put_contents("{$path}/resources/js/index.jsx", $jsx);

        // Generate webpack
        $webpack = file_get_contents(__DIR__ . "/stubs/webpack");
        $webpack = str_replace("%SLUG%", $slug, $webpack);

        file_put_contents("{$path}/webpack.mix.js", $webpack);

        $class = "Modules\\{$dir}\Module";

        return resolve($class);
    }

    /**
     * Set module middlewares.
     *
     * @param string|array $items
     * @return self
     */
    function set_middlewares($items) {
        $items = Arr::wrap($items);
        $this->middlewares = "['" . join("', '", $m) . "']";

        return $this;
    }
}
