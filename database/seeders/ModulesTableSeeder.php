<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Database\Seeder;
use App\Models\Module as ModuleModel;

class ModulesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        foreach (config("modules") as $module) {
            ModuleModel::firstOrCreate(["uid" => $module["uid"]], [
                "uid" => $module["uid"],
            ]);
        }
    }
}
