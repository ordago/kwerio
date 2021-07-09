<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant\{
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
    }
}
