<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ability;
use App\Models\Group;
use App\Models\Module as ModuleModel;
use Illuminate\Support\Str;

class AbilitiesTableSeeder extends Seeder
{
    public $abilities = [
        "root/user_delete_root" => "Users / Delete root users",
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $actions = [
            "create" => "Add new %s",
            "delete" => "Remove %s",
            "disable" => "Disable %s",
            "duplicate" => "Duplicate %s",
            "enable" => "Enable %s",
            "filter" => "Filter %s",
            "index" => "List available %s",
            "update" => "Update existing %s",
        ];

        foreach ($actions as $action => $description) {
            foreach (["user", "group", "api_user"] as $item) {
                $itemstr = Str::plural(str_replace("_", " ", $item));

                $this->abilities = array_merge($this->abilities, [
                    "root/{$item}_{$action}" => ucwords($itemstr) . " / " . sprintf($description, $itemstr),
                ]);
            }
        }

        $firstOrCreate = function($ability, $description, $module_id) {
            return Ability::firstOrCreate(["name" => $ability], [
                "module_id" => $module_id,
                "name" => $ability,
                "description" => $description,
            ]);
        };

        // Remove all groups abilities
        foreach (Group::get() as $group) {
            $group->abilities()->detach();
        }

        // Store core abilities.
        $abilities = [];

        foreach ($this->abilities as $ability => $description) {
            $abilities[] = $firstOrCreate($ability, $description, null)->id;
        }

        $rootGroup = Group::whereSlug("root")->firstOrFail();
        $rootGroup->abilities()->syncWithoutDetaching($abilities);

        // Store modules abilities.
        foreach (config("modules") as $module) {
            $config = require base_path("modules/{$module["uid"]}/config/module.php");
            $moduleModel = ModuleModel::whereUid($module["uid"])->firstOrFail();
            $group = Group::whereSlug($module["uid"])->firstOrFail();

            if (!empty($config["abilities"])) {
                $abilities = [];

                foreach ($config["abilities"] as $ability => $description) {
                    $abilities[] = $firstOrCreate("{$module['uid']}/{$ability}", $description, $moduleModel->id)->id;
                }

                $group->abilities()->syncWithoutDetaching($abilities);
            }
        }
    }
}
