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
        "root/user_list" => "Users / List available users",
        "root/user_create" => "Users / Create new user",
        "root/user_update" => "Users / Update an existing user",
        "root/user_delete" => "Users / Delete existing user",
        "root/user_delete_root" => "Users / Delete root user",

        // Api Users
        "root/api_user_list" => "Api Users / List available api users",
        "root/api_user_create" => "Api Users / Create new api user",
        "root/api_user_update" => "Api Users / Update existing api user",
        "root/api_user_delete" => "Api Users / Delete existing api user",

        // Groups
        "root/group_list" => "Groups / List available groups",
        "root/group_create" => "Groups / Create new group",
        "root/group_update" => "Groups / Update an existing group",
        "root/group_delete" => "Groups / Delete existing group",
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
