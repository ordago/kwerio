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
            {-d|--dependency=* : List of module dependencies}
    ";

    protected $description = "Install new module";

    function handle() {
        $maker = resolve(Maker::class);

        $name = $this->argument("name");
        $path = $this->option("path");
        $deps = $this->option("dependency");

        if ($name) {
            $maker->set_name($name)
                ->set_dependencies($deps ?? [])
                ->create();
        } else if ($path) {
            $maker->set_dependencies($deps ?? [])
                ->create_from_path($path);
        } else {
            throw new \Exception("A {name} or {path} is required to create a module");
        }
    }
}
