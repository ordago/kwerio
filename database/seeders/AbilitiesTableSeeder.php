<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ability;
use App\Models\Group;
use App\Models\Module as ModuleModel;

class AbilitiesTableSeeder extends Seeder
{
    public $abilities = [
        // Users
        "root/user_list" => "List available users",
        "root/user_create" => "Create new user",
        "root/user_update" => "Update an existing user",
        "root/user_delete" => "Delete existing user",
        "root/user_delete_root" => "Delete root user",

        // Api Users
        "root/api_user_list" => "List available api users",
        "root/api_user_create" => "Create new api user",
        "root/api_user_update" => "Update existing api user",
        "root/api_user_delete" => "Delete existing api user",

        // Groups
        "root/group_list" => "List available groups",
        "root/group_create" => "Create new group",
        "root/group_update" => "Update an existing group",
        "root/group_delete" => "Delete existing group",
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $firstOrCreate = function($ability, $description, $module_id) {
            return Ability::firstOrCreate(["name" => $ability], [
                "module_id" => $module_id,
                "name" => $ability,
                "description" => $description,
            ]);
        };

        // Store core abilities.
        foreach ($this->abilities as $ability => $description) {
            $firstOrCreate($ability, $description, null);
        }

        // Store modules abilities.
        foreach (config("modules") as $module) {
            $config = require base_path("modules/{$module["uid"]}/config/module.php");
            $moduleModel = ModuleModel::whereUid($module["uid"])->firstOrFail();
            $group = Group::whereSlug($module["uid"])->firstOrFail();

            if (!empty($config["abilities"])) {
                $abilities = [];

                foreach ($config["abilities"] as $ability => $description) {
                    $abilities[] = $firstOrCreate($ability, $description, $moduleModel->id)->id;
                }

                $group->abilities()->syncWithoutDetaching($abilities);
            }
        }
    }
}
