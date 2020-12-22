<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    Group,
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
        $root = Group::create([
            "name" => "root",
        ]);
    }
}
