<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Database\Seeder;

class ModulesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $core_modules = [
            "About",
            "BasicAuthentication",
            "Home",
        ];

        foreach ($core_modules as $module) {
            $path = base_path("modules/{$module}");

            if (file_exists($path)) {
                Artisan::call("module:install", [
                    "--path" => base_path("modules/{$module}"),
                ]);
            }
        }
    }
}
