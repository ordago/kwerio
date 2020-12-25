<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    Group as GroupModel,
    Module as ModuleModel,
};

class GroupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $root = GroupModel::firstOrCreate(["name" => "root"], [
            "name" => "root",
            "slug" => "root",
        ]);

        $modules = collect(config("modules"));

        ModuleModel::get()->each(function($item) use($modules) {
            $module = $modules->where("uid", $item->uid)->first();

            if ($module) {
                $group = GroupModel::firstOrCreate(["slug" => $item->uid], [
                    "name" => $module["name"],
                    "slug" => $item->uid,
                ]);

                $group->modules()->sync($item);
            }
        });
    }
}
