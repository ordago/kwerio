<?php

use Symfony\Component\Finder\Finder;
use Illuminate\Database\Migrations\Migration;
use Symfony\Component\Finder\Exception\DirectoryNotFoundException;

class Modules extends Migration {
    public function up() {
        $finder = new Finder;

        try {
            $finder
                ->files()
                ->in(base_path("modules/*/database/migrations"))
                ->name("/\.php$/")
                ->sortByName(true);
        }

        catch (DirectoryNotFoundException $e) {
            return;
        }

        foreach($finder as $file) {
            $config = require $file->getPathInfo()->getPath() . "/../config/module.php";
            preg_match("/\/modules\/.*/", $file->getPathname(), $m);

            Artisan::call("migrate", [
                "--path" => ltrim($m[0], "/"),
                "--force" => true,
            ]);

            echo Artisan::output();
        }
    }
}

