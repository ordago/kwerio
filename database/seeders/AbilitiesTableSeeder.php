<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

use App\Models\{
    Ability,
    Group,
    Module as ModuleModel,
};

class AbilitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $abilities = $this->_create_system_abilities();

        $this->_reset_root_group_abilities($abilities);

        // Store modules abilities.
        foreach (resolve("modules")->toArray() as $module) {
            $moduleModel = ModuleModel::whereUid($module->uid)->first();

            if (!$moduleModel) {
                $this->command->comment("[ SKIP ] Module {$module->uid} is not installed");
                continue;
            }

            $group = Group::whereSlug($module->uid)->first();

            if (!$group) {
                $this->command->comment("[ SKIP ] No group is registered for module {$module->uid}");
                continue;
            };

            if (empty($module->config["abilities"])) {
                $this->command->comment("[ SKIP ] Module {$module->uid} has no abilities registered");
            } else {
                $abilities = [];

                foreach ($module->config["abilities"] as $ability => $description) {
                    $abilities[] = $this->_first_or_create("{$module->uid}/{$ability}", $description, $moduleModel->id)->id;
                }

                $group->abilities()->syncWithoutDetaching($abilities);
            }
        }
    }

    /**
     * This will reset all abilities to the groups that are not system.
     */
    private function _reset_root_group_abilities($abilities) {
        $rootGroup = Group::whereSlug("root")->firstOrFail();
        $rootGroup->abilities()->sync($abilities->pluck("id"));
    }

    /**
     * Create an ability if not exists, and return it.
     */
    private function _first_or_create($ability, $description, $module_id) {
        return Ability::firstOrCreate(["name" => $ability], [
            "module_id" => $module_id,
            "name" => $ability,
            "description" => $description,
        ]);
    }

    /**
     * Get abilities.
     */
    private function _create_system_abilities() {
        $abilities = collect();

        $abilities[] = $this->_first_or_create(
            "root/user_delete_root",
            "Users / Delete root users",
            null,
        );

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

                $abilities[] = $this->_first_or_create(
                    "root/{$item}_{$action}",
                    ucwords($itemstr) . " / " . sprintf($description, $itemstr),
                    null,
                );
            }
        }

        return $abilities;
    }
}
