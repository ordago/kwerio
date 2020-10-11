<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Base\Module\Maker;

class ModuleInstall extends Command
{
    protected $signature = "
        module:install
            {name? : Module name}
            {-p|--path= : Local path to module}
    ";

    protected $description = "Install new module";

    function handle() {
        $maker = resolve(Maker::class);

        $name = $this->argument("name");
        $path = $this->option("path");

        if ($name) {
            $maker->create($name);
        } else if ($path) {
            $maker->create_from_path($path);
        } else {
            throw new \Exception("A {name} or {path} is required to create a module");
        }
    }
}
